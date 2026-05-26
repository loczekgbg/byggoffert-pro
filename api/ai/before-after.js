export const config = {
  runtime: "edge",
};

const openAiImageEditUrl = "https://api.openai.com/v1/images/edits";
const openAiModelUrl = "https://api.openai.com/v1/models";
const defaultModel = "gpt-image-1";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function envValue(name, fallback = "") {
  return globalThis.process?.env?.[name] || fallback;
}

function modelName() {
  return envValue("OPENAI_IMAGE_MODEL", defaultModel);
}

function diagnosticLog(event, details = {}) {
  const safeDetails = Object.fromEntries(
    Object.entries(details).filter(([key]) => !key.toLowerCase().includes("key")),
  );

  console.info(`[ai-before-after] ${event}`, safeDetails);
}

function diagnosticError(event, details = {}) {
  const safeDetails = Object.fromEntries(
    Object.entries(details).filter(([key]) => !key.toLowerCase().includes("key")),
  );

  console.error(`[ai-before-after] ${event}`, safeDetails);
}

function sanitizeOpenAiError(data, fallback) {
  const message = data?.error?.message || data?.message || fallback;

  return String(message).replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]");
}

async function readOpenAiResponse(response) {
  const rawText = await response.text();

  try {
    return {
      data: rawText ? JSON.parse(rawText) : {},
      rawText,
    };
  } catch {
    return {
      data: null,
      rawText,
      parseError: true,
    };
  }
}

function invalidAiResponse(rawText) {
  return jsonResponse({
    status: "api_error",
    error: "Invalid AI response",
    message: "Invalid AI response",
    details: String(rawText || "").slice(0, 500),
  }, 502);
}

async function parseOpenAiResponse(response) {
  const parsed = await readOpenAiResponse(response);

  if (parsed.parseError) {
    return {
      ok: false,
      status: response.status,
      invalid: true,
      rawText: parsed.rawText,
      message: "Invalid AI response",
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      data: parsed.data,
      message: sanitizeOpenAiError(parsed.data, `OpenAI API error ${response.status}.`),
    };
  }

  return {
    ok: true,
    status: response.status,
    data: parsed.data,
    rawText: parsed.rawText,
  };
}

function imageDataUrlFromOpenAi(data) {
  const image = data?.data?.[0] || {};
  const b64 = image.b64_json || image.base64 || image.image_base64 || data?.b64_json || data?.base64;
  const url = image.url || data?.url || data?.imageUrl || data?.afterImage;

  if (b64) {
    return b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`;
  }

  return url || "";
}

function apiErrorResponse(parsed, model) {
  if (parsed.invalid) {
    return invalidAiResponse(parsed.rawText);
  }

  return jsonResponse({
    status: "api_error",
    error: parsed.message || "AI API error",
    message: parsed.message || "AI API error",
    model,
  }, parsed.status || 502);
}

export async function handleStatus(request) {
  const apiKey = envValue("OPENAI_API_KEY");
  const model = modelName();
  const shouldCheckOpenAI = new URL(request.url).searchParams.get("check") === "1";

  diagnosticLog("status", {
    endpoint: new URL(request.url).pathname,
    model,
    checkOpenAI: shouldCheckOpenAI,
    configured: Boolean(apiKey),
  });

  if (!apiKey) {
    return jsonResponse({
      status: "missing_config",
      configured: false,
      endpointResponds: true,
      endpointExists: true,
      model,
      provider: "openai",
      message: "OPENAI_API_KEY is missing on the backend.",
    }, 503);
  }

  if (!shouldCheckOpenAI) {
    return jsonResponse({
      status: "configured",
      configured: true,
      endpointResponds: true,
      endpointExists: true,
      model,
      provider: "openai",
      message: "Backend endpoint is configured.",
    });
  }

  const response = await fetch(`${openAiModelUrl}/${encodeURIComponent(model)}`, {
    headers: {
      authorization: `Bearer ${apiKey}`,
    },
  });

  const modelStatus = await parseOpenAiResponse(response);

  diagnosticLog("openai-model-status", {
    endpoint: openAiModelUrl,
    model,
    openAiStatus: response.status,
  });

  if (!modelStatus.ok) {
    diagnosticError("openai-model-error", {
      model,
      openAiStatus: modelStatus.status,
      message: modelStatus.message,
    });

    return jsonResponse({
      status: "api_error",
      configured: true,
      endpointResponds: true,
      endpointExists: true,
      model,
      provider: "openai",
      message: modelStatus.message,
    }, 502);
  }

  return jsonResponse({
    status: "configured",
    configured: true,
    endpointResponds: true,
    endpointExists: true,
    model,
    provider: "openai",
    message: "OpenAI connection is ready.",
  });
}

async function handleGeneration(request) {
  const apiKey = envValue("OPENAI_API_KEY");
  const model = modelName();

  diagnosticLog("generate", {
    endpoint: new URL(request.url).pathname,
    model,
    configured: Boolean(apiKey),
  });

  if (!apiKey) {
    return jsonResponse({
      status: "missing_config",
      model,
      message: "OPENAI_API_KEY is missing on the backend.",
    }, 503);
  }

  let incomingFormData;

  try {
    incomingFormData = await request.formData();
  } catch {
    return jsonResponse({
      status: "api_error",
      model,
      message: "Invalid multipart request.",
    }, 400);
  }

  const image = incomingFormData.get("image");
  const prompt = incomingFormData.get("prompt");

  if (!image || typeof prompt !== "string" || !prompt.trim()) {
    return jsonResponse({
      status: "api_error",
      model,
      message: "Image and prompt are required.",
    }, 400);
  }

  const openAiFormData = new FormData();

  openAiFormData.append("model", model);
  openAiFormData.append("prompt", prompt);
  openAiFormData.append("image", image);
  openAiFormData.append("size", envValue("OPENAI_IMAGE_SIZE", "auto"));
  openAiFormData.append("quality", envValue("OPENAI_IMAGE_QUALITY", "high"));
  openAiFormData.append("output_format", envValue("OPENAI_IMAGE_OUTPUT_FORMAT", "jpeg"));
  openAiFormData.append("n", "1");

  const response = await fetch(openAiImageEditUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
    },
    body: openAiFormData,
  });

  const parsed = await parseOpenAiResponse(response);

  diagnosticLog("openai-image-edit-status", {
    endpoint: openAiImageEditUrl,
    model,
    openAiStatus: response.status,
  });

  if (!parsed.ok) {
    diagnosticError("openai-image-edit-error", {
      model,
      openAiStatus: parsed.status,
      message: parsed.message,
    });

    return apiErrorResponse(parsed, model);
  }

  const imageUrl = imageDataUrlFromOpenAi(parsed.data);

  if (!imageUrl) {
    diagnosticError("openai-image-edit-empty", {
      model,
      openAiStatus: response.status,
      message: "No image returned from AI",
    });

    return jsonResponse({
      status: "api_error",
      error: "No image returned from AI",
      message: "No image returned from AI",
      model,
    }, 502);
  }

  return jsonResponse({
    ...parsed.data,
    status: "configured",
    provider: "openai",
    model,
    imageUrl,
    afterImage: imageUrl,
  });
}

export default function handler(request) {
  if (request.method === "GET") {
    return handleStatus(request);
  }

  if (request.method === "POST") {
    return handleGeneration(request);
  }

  return jsonResponse({
    status: "api_error",
    message: "Method not allowed.",
  }, 405);
}
