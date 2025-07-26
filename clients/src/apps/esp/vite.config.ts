import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }] },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[hash].js",
        assetFileNames: "[hash][extname]"
      }
    }
  }
});
