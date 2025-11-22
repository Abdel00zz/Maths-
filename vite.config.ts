import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react({
          // Enable Fast Refresh for better development experience
          fastRefresh: true,
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Output directory for production build
        outDir: 'dist',
        // Generate sourcemaps for better debugging
        sourcemap: !isProduction,
        // Optimize chunks for better caching
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunks for better caching
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'query-vendor': ['@tanstack/react-query'],
              'math-vendor': ['katex'],
            },
            // Clean asset naming for production
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name?.split('.');
              const ext = info?.[info.length - 1];
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
                return `assets/images/[name]-[hash][extname]`;
              } else if (/woff2?|ttf|eot/i.test(ext || '')) {
                return `assets/fonts/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            },
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
          }
        },
        // Increase chunk size warning limit for math libraries
        chunkSizeWarningLimit: 1000,
        // Minification
        minify: isProduction ? 'esbuild' : false,
        // Target modern browsers for better performance
        target: 'es2020',
        // CSS code splitting
        cssCodeSplit: true,
      },
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'katex'],
      },
      // Preview server settings (for local testing after build)
      preview: {
        port: 4173,
        host: '0.0.0.0',
      }
    };
});
