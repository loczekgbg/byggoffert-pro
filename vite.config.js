import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'
import beforeAfterHandler from './api/ai/before-after.js'
import statusHandler from './api/ai/status.js'

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

console.log('[ai-before-after] env', {
  hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
  model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
});

function collectBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function toWebRequest(req, origin) {
  const url = new URL(req.originalUrl || req.url, origin);
  const headers = new Headers();

  Object.entries(req.headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => headers.append(key, item));
    } else if (value) {
      headers.set(key, value);
    }
  });

  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await collectBody(req);

  return new Request(url, {
    method: req.method,
    headers,
    body,
    duplex: body ? 'half' : undefined,
  });
}

async function sendWebResponse(res, response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}

function aiApiMiddleware(origin) {
  return async (req, res, next) => {
    const pathname = new URL(req.originalUrl || req.url, origin).pathname;
    const handler = pathname === '/api/ai/status'
      ? statusHandler
      : pathname === '/api/ai/before-after'
        ? beforeAfterHandler
        : null;

    if (!handler) {
      next();
      return;
    }

    try {
      const request = await toWebRequest(req, origin);
      const response = await handler(request);

      await sendWebResponse(res, response);
    } catch (error) {
      console.error('[vite-ai-api] local backend error', {
        endpoint: pathname,
        message: error instanceof Error ? error.message : String(error),
      });
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({
        status: 'api_error',
        message: 'Local AI backend error.',
      }));
    }
  };
}

function localAiApiPlugin() {
  return {
    name: 'local-ai-api',
    configureServer(server) {
      server.middlewares.use(aiApiMiddleware('http://localhost'));
    },
    configurePreviewServer(server) {
      server.middlewares.use(aiApiMiddleware('http://localhost'));
    },
  };
}

export default defineConfig({
  plugins: [
    localAiApiPlugin(),
    react(),
    tailwindcss(),
  ],
})
