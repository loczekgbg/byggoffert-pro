const backendEndpoint = import.meta.env.VITE_AI_BEFORE_AFTER_ENDPOINT || "/api/ai/before-after";
const statusEndpoint = import.meta.env.VITE_AI_STATUS_ENDPOINT || "/api/ai/status";

function buildBeforeAfterPrompt(payload) {
  const customerWishes = payload.customerWishes?.trim() || "Photorealistic renovation matching the selected style and user settings.";
  const settings = [
    payload.woodColor ? `Wood color: ${payload.woodColor}` : "",
    payload.wallColor ? `Wall color: ${payload.wallColor}` : "",
    payload.finishType ? `Finish / ytfinish: ${payload.finishType}` : "",
    payload.brightness ? `Brightness / ljusstyrka: ${payload.brightness}%` : "",
    payload.woodAmount ? `Wood amount: ${payload.woodAmount}%` : "",
    payload.changeLevel ? `Change level: ${payload.changeLevel}` : "",
  ].filter(Boolean).join("\n");

  return [
    "Original photo of a house, interior, deck, facade, garden, or project.",
    "Create a photorealistic after-renovation visualization based on the input photo.",
    "Preserve the original perspective, camera angle, framing, building proportions, walls, windows, doors, floors, and surroundings.",
    "Do not change human faces, incidental objects, or geometry that is not part of the requested renovation.",
    "Do not create a sketch, illustration, drawing, cartoon style, or UI placeholder.",
    "Preserve natural light, shadows, textures, and realistic materials.",
    `Requested changes: ${customerWishes}`,
    `Styl: ${payload.style || "Modern"}`,
    `Typ projektu: ${payload.projectType || "Before / After"}`,
    settings ? `Additional settings:\n${settings}` : "",
    "The final image must look like a real photo after the work has been completed.",
  ].filter(Boolean).join("\n");
}

async function dataUrlToFile(dataUrl, fileName) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const extension = blob.type.includes("jpeg") ? "jpg" : blob.type.includes("webp") ? "webp" : "png";

  return new File([blob], `${fileName}.${extension}`, { type: blob.type || "image/png" });
}

function normalizeImageResult(data) {
  const image = data?.data?.[0] || data?.image || data?.result;
  const base64 = image?.b64_json || image?.base64 || image?.image_base64 || data?.b64_json || data?.base64;
  const url = image?.url || data?.url || data?.afterImage;

  if (base64) return base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
  if (url) return url;

  throw new Error("AI image response did not include an image.");
}

function buildFormData(payload, prompt) {
  const formData = new FormData();

  formData.append("prompt", prompt);

  return dataUrlToFile(payload.beforeImage, "before").then((beforeFile) => {
    formData.append("image", beforeFile);
    formData.append("metadata", JSON.stringify({
      projectType: payload.projectType,
      style: payload.style,
      customerWishes: payload.customerWishes || "",
      settings: {
        woodColor: payload.woodColor || "",
        wallColor: payload.wallColor || "",
        brightness: payload.brightness,
        woodAmount: payload.woodAmount,
        finishType: payload.finishType || "",
        changeLevel: payload.changeLevel,
      },
    }));

    return formData;
  });
}

async function generateWithBackend(payload, prompt, onProgress) {
  onProgress?.(28);
  const body = await buildFormData(payload, prompt);
  onProgress?.(42);

  const response = await fetch(backendEndpoint, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const details = await readErrorMessage(response);
    throw new Error(details || `AI backend failed with status ${response.status}.`);
  }

  onProgress?.(82);
  const data = await response.json();

  return {
    afterImage: normalizeImageResult(data),
    provider: data?.provider || "openai",
    model: data?.model,
    raw: data,
  };
}

async function readErrorMessage(response) {
  const rawText = await response.text();

  try {
    const data = rawText ? JSON.parse(rawText) : {};

    return data?.message || data?.error?.message || "";
  } catch {
    return rawText;
  }
}

export const AIService = {
  isConfigured() {
    return Boolean(backendEndpoint);
  },

  buildBeforeAfterPrompt,

  async getStatus() {
    try {
      const response = await fetch(`${statusEndpoint}?check=1`, { method: "GET" });
      const rawText = await response.text();
      let data = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = { message: rawText };
      }

      if (!response.ok) {
        const endpointResponds = response.status !== 404;

        return {
          status: data?.status || "api_error",
          configured: Boolean(data?.configured),
          endpointResponds,
          endpointExists: endpointResponds,
          message: response.status === 404
            ? "Backend AI nie jest uruchomiony"
            : data?.message || `AI backend failed with status ${response.status}.`,
          model: data?.model || "",
          provider: data?.provider || "openai",
        };
      }

      return {
        status: data?.status || "configured",
        configured: Boolean(data?.configured ?? true),
        endpointResponds: true,
        endpointExists: Boolean(data?.endpointExists ?? true),
        message: data?.message || "",
        model: data?.model || "",
        provider: data?.provider || "openai",
      };
    } catch (error) {
      return {
        status: "backend_missing",
        configured: false,
        endpointResponds: false,
        endpointExists: false,
        message: "Backend AI nie jest uruchomiony",
        model: "",
        provider: "openai",
        details: error instanceof Error ? error.message : "",
      };
    }
  },

  async generateBeforeAfter(payload, options = {}) {
    const prompt = buildBeforeAfterPrompt(payload);

    options.onProgress?.(12);

    const result = await generateWithBackend(payload, prompt, options.onProgress);

    options.onProgress?.(100);

    return {
      ...result,
      model: result.model,
      prompt,
    };
  },
};
