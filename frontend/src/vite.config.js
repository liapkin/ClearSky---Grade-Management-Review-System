import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  
  server: {
    port: 5173,
    open: true,
    
   
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  envPrefix: 'VITE_'
})