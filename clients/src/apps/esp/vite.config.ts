import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "./",
    plugins: [react(), tailwindcss()],
    resolve: { alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }] },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "[hash].js",
          chunkFileNames: "[hash].js",
          assetFileNames: "[hash][extname]",
          manualChunks: {
            react: ["react"],
            "react-dom": ["react-dom"],
            "react-router": ["react-router"],
            pkgs: ["@pkgs/hooks", "@pkgs/components", "@pkgs/utils"],
            others: ["zod", "clsx"]
          }
        }
      }
    },
    server: {
      proxy: {
        "/api": {
          target: env.ESP_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api")
        }
      }
    }
  };
});
