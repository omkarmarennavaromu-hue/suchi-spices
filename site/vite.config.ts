import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import createOrder from './api/create-order.ts';
import verifyPayment from './api/verify-payment.ts';
import paymentConfig from './api/payment-config.ts';
import type { ApiHandler } from './api/_http.ts';

/**
 * Vercel serves everything in `api/` as serverless functions. `vite dev` does
 * not, so without this the checkout would 404 on every local run and the button
 * would sit in its "not configured" state even when keys are present.
 *
 * This adapter is dev-only. It is not part of the production build, and Vercel
 * never runs it — the real functions are deployed from `api/` directly.
 */
const routes: Record<string, ApiHandler> = {
  '/create-order': createOrder,
  '/verify-payment': verifyPayment,
  '/payment-config': paymentConfig,
};

function localApi(): Plugin {
  return {
    name: 'suchi-local-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        const path = (req.url ?? '').split('?')[0].replace(/\/+$/, '') || '/';
        const handler = routes[path];
        if (!handler) {
          next();
          return;
        }

        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          let body: unknown = {};
          if (raw) {
            try {
              body = JSON.parse(raw);
            } catch {
              body = {};
            }
          }

          const headers: Record<string, string> = {};

          const fakeRes = {
            status(code: number) {
              res.statusCode = code;
              return fakeRes;
            },
            setHeader(name: string, value: string) {
              headers[name] = value;
            },
            json(payload: unknown) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              for (const [name, value] of Object.entries(headers)) {
                res.setHeader(name, value);
              }
              res.end(JSON.stringify(payload));
            },
          };

          void Promise.resolve(handler({ method: req.method, body }, fakeRes)).catch(
            (error: unknown) => {
              server.config.logger.error(`[local-api] ${path} failed: ${String(error)}`);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ error: 'local_api_failed' }));
              }
            },
          );
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApi()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // The sandbox preview is served from a proxied host — allow it.
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
});
