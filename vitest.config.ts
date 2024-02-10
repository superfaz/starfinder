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
      app: path.resolve(__dirname, "./app"),
      data: path.resolve(__dirname, "./data"),
      logic: path.resolve(__dirname, "./logic"),
      model: path.resolve(__dirname, "./model"),
    },
    exclude: ["e2e/*.*"],
  },
});
