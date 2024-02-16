import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      reporter: ["lcovonly", "text"],
    },
    environment: "happy-dom",
    setupFiles: ["vitest.setup.ts"],
    alias: {
      app: path.resolve(__dirname, "./src/app"),
      data: path.resolve(__dirname, "./src/data"),
      logic: path.resolve(__dirname, "./src/logic"),
      model: path.resolve(__dirname, "./src/model"),
      view: path.resolve(__dirname, "./src/view"),
    },
    exclude: ["e2e/*.*"],
  },
});
