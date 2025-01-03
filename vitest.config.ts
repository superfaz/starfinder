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
      mocks: path.resolve(__dirname, "./mocks"),
      model: path.resolve(__dirname, "./src/model"),
      navigation: path.resolve(__dirname, "./src/navigation"),
      ui: path.resolve(__dirname, "./src/ui"),
      view: path.resolve(__dirname, "./src/view"),
      "server-only": path.resolve(__dirname, "./mocks/server-only.ts"),
    },
    exclude: ["e2e/*.*", "node_modules"],
  },
});
