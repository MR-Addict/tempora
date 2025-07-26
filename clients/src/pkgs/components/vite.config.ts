import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "components"
    },
    rollupOptions: {
      external: ["react", "react-dom", "zod", /^@pkgs\/.*/]
    }
  }
});
