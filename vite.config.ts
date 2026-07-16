import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '^/api/ai': {
          target: env.VITE_AI_API_BASE || 'https://token.sensenova.cn',
          changeOrigin: true,
          secure: true,
          rewrite: (p) => '/v1' + p.replace(/^\/api\/ai/, ''),
          proxyTimeout: 120000,
          timeout: 120000,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_AI_API_KEY}`);
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
              proxyRes.headers['Access-Control-Expose-Headers'] = '*';
              proxyRes.headers['Access-Control-Max-Age'] = '86400';
              proxyRes.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
              proxyRes.headers['Pragma'] = 'no-cache';
              proxyRes.headers['X-Accel-Buffering'] = 'no';
            });
          },
        },
        '^/api/search': {
          target: env.VITE_SEARCH_API_BASE || 'https://api.anysearch.com',
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/search/, ''),
          proxyTimeout: 30000,
          configure: (proxy) => {
            proxy.on('proxyReq', (req) => {
              req.setHeader('Authorization', `Bearer ${env.VITE_SEARCH_API_KEY}`);
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
            });
          },
        },
      },
    },
    preview: {
      proxy: {
        '^/api/ai': {
          target: env.VITE_AI_API_BASE || 'https://token.sensenova.cn',
          changeOrigin: true,
          secure: true,
          rewrite: (p) => '/v1' + p.replace(/^\/api\/ai/, ''),
          proxyTimeout: 120000,
          timeout: 120000,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_AI_API_KEY}`);
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
              proxyRes.headers['Access-Control-Expose-Headers'] = '*';
              proxyRes.headers['Access-Control-Max-Age'] = '86400';
              proxyRes.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
              proxyRes.headers['Pragma'] = 'no-cache';
              proxyRes.headers['X-Accel-Buffering'] = 'no';
            });
          },
        },
        '^/api/search': {
          target: env.VITE_SEARCH_API_BASE || 'https://api.anysearch.com',
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/search/, ''),
          proxyTimeout: 30000,
          configure: (proxy) => {
            proxy.on('proxyReq', (req) => {
              req.setHeader('Authorization', `Bearer ${env.VITE_SEARCH_API_KEY}`);
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
            });
          },
        },
      },
    },
  };
});
