import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
    hmr: {
      clientPort: 5173
    },
    watch: {
      usePolling: true
    },
    proxy: {
      '/api/user-management': {
        target: 'http://user-management:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/user-management/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/grades': {
        target: 'http://grades:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/grades/, '')
      },
      '/api/statistics': {
        target: 'http://statistics:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/statistics/, '')
      },
      '/api/reviews': {
        target: 'http://review:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/reviews/, '')
      },
      '/api/institutions': {
        target: 'http://institution-service:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/institutions/, '/institutions')
      }
    }
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    
    minify: 'esbuild',
    target: 'esnext'
  },
  
  envPrefix: 'VITE_'
})