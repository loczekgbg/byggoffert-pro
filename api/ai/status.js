import { handleStatus } from "./before-after.js";

export const config = {
  runtime: "edge",
};

export default function handler(request) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({
      configured: false,
      endpointExists: true,
      provider: "openai",
      status: "api_error",
      message: "Method not allowed.",
    }), {
      status: 405,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  return handleStatus(request);
}
