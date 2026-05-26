const openAiImageEditUrl = "https://api.openai.com/v1/images/edits";
const defaultModel = import.meta.env.VITE_AI_BEFORE_AFTER_MODEL || "gpt-image-1.5";
const proxyEndpoint = import.meta.env.VITE_AI_BEFORE_AFTER_ENDPOINT || "";
const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY || "";

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

  formData.append("model", defaultModel);
  formData.append("prompt", prompt);
  formData.append("size", "1024x1024");
  formData.append("quality", "high");
  formData.append("n", "1");

  return dataUrlToFile(payload.beforeImage, "before").then(async (beforeFile) => {
    if (payload.afterImage) {
      const afterReferenceFile = await dataUrlToFile(payload.afterImage, "after-reference");
      formData.append("image[]", beforeFile);
      formData.append("image[]", afterReferenceFile);
    } else {
      formData.append("image", beforeFile);
    }

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

async function generateWithProxy(payload, prompt, onProgress) {
  onProgress?.(28);
  const body = await buildFormData(payload, prompt);
  onProgress?.(42);

  const response = await fetch(proxyEndpoint, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `AI proxy failed with status ${response.status}.`);
  }

  onProgress?.(82);
  const data = await response.json();

  return {
    afterImage: normalizeImageResult(data),
    provider: "proxy",
    raw: data,
  };
}

async function generateWithOpenAI(payload, prompt, onProgress) {
  onProgress?.(28);
  const body = await buildFormData(payload, prompt);
  onProgress?.(42);

  const response = await fetch(openAiImageEditUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `OpenAI image edit failed with status ${response.status}.`);
  }

  onProgress?.(82);
  const data = await response.json();

  return {
    afterImage: normalizeImageResult(data),
    provider: "openai",
    raw: data,
  };
}

export const AIService = {
  isConfigured() {
    return Boolean(proxyEndpoint || openAiApiKey);
  },

  buildBeforeAfterPrompt,

  async generateBeforeAfter(payload, options = {}) {
    const prompt = buildBeforeAfterPrompt(payload);

    options.onProgress?.(12);

    const result = proxyEndpoint
      ? await generateWithProxy(payload, prompt, options.onProgress)
      : await generateWithOpenAI(payload, prompt, options.onProgress);

    options.onProgress?.(100);

    return {
      ...result,
      model: defaultModel,
      prompt,
    };
  },
};
