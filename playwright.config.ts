import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` });
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}

dotenv.config({ path: ".env" });

export function isMainProcess() {
  return process.argv[1] && /cli\.js$/.test(process.argv[1]);
}

/* Base URL to use in actions like `await page.goto('/')`. */
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

if (isMainProcess()) {
  console.log("Using base URL: ", baseURL);
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  fullyParallel: true,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
