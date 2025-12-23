/*
 * This file enables Playwright client to connect to remote browsers.
 * It should be placed in the same directory as playwright.config.ts.
 */

import { defineConfig } from "@playwright/test";
import { z } from "zod";
import config, { isMainProcess } from "./playwright.config";

// Define environment on the dev box in .env file:
//  .env:
//    PLAYWRIGHT_SERVICE_ACCESS_TOKEN=XXX
//    PLAYWRIGHT_SERVICE_URL=XXX

// Define environment in your GitHub workflow spec.
//  env:
//    PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
//    PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
//    PLAYWRIGHT_SERVICE_RUN_ID: ${{ github.run_id }}-${{ github.run_attempt }}-${{ github.sha }}

// Validate the environment
if (!process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN || !process.env.PLAYWRIGHT_SERVICE_URL) {
  throw new Error("Missing PLAYWRIGHT_SERVICE_ACCESS_TOKEN or PLAYWRIGHT_SERVICE_URL environment variables");
}

const osSchema = z.enum(["linux", "windows"]).optional();
if (!osSchema.safeParse(process.env.PLAYWRIGHT_SERVICE_OS).success) {
  throw new Error("If defined, PLAYWRIGHT_SERVICE_OS must be 'linux' or 'windows' (will be 'linux' by default)");
}

// Can be 'linux' or 'windows'
const os = process.env.PLAYWRIGHT_SERVICE_OS ?? "linux";

// Name the test run if it's not named yet
const runId = process.env.PLAYWRIGHT_SERVICE_RUN_ID ?? new Date().toISOString();

if (isMainProcess()) {
  console.log("Executed with Microsoft Playwright Testing service");
}

export default defineConfig(config, {
  workers: 20,
  timeout: 10000,

  // Enable screenshot testing and configure directory with expectations.
  // https://learn.microsoft.com/azure/playwright-testing/how-to-configure-visual-comparisons
  ignoreSnapshots: false,
  snapshotPathTemplate: `{testDir}/__screenshots__/{testFilePath}/${os}/{arg}{ext}`,

  use: {
    // Specify the service endpoint.
    connectOptions: {
      wsEndpoint: `${process.env.PLAYWRIGHT_SERVICE_URL}?cap=${JSON.stringify({
        os,
        runId,
      })}`,
      timeout: 30000,
      headers: {
        "x-mpt-access-key": process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN!,
      },
      // Allow service to access the localhost.
      exposeNetwork: "<loopback>",
    },
  },
  // Temp workaround for config merge bug in OSS https://github.com/microsoft/playwright/pull/28224
  projects: config.projects ? config.projects : [{}],
});
