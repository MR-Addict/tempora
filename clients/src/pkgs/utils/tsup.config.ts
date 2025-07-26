import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  format: "esm",
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom", "zod", /^@pkgs\/.*/]
});
