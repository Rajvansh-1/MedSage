import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // The proxy block has been completely removed!
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.MEDGEMMA_API_URL': JSON.stringify(env.MEDGEMMA_API_URL)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      },
      build: {
        outDir: 'dist',
        sourcemap: false,
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'lucide-react', 'recharts'],
              gemini: ['@google/genai'],
              supabase: ['@supabase/supabase-js'],
            }
          }
        }
      }
    };
});