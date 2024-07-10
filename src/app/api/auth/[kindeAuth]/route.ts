import { has } from "@vercel/edge-config";
import handleAuth from "./auth";
import { ClientOptions } from "./types";

async function overrideConfig(): Promise<ClientOptions> {
  if (process.env.VERCEL && process.env.VERCEL_URL && process.env.VERCEL_ENV === "production") {
    // When deploying to vercel production
    // Check if the project is flagged as tested and promoted to select the correct base url
    if (await has(process.env.VERCEL_URL)) {
      return {
        siteUrl: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
        postLoginRedirectUrl: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
        postLogoutRedirectUrl: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
      };
    } else {
      return {
        siteUrl: `https://${process.env.VERCEL_URL}`,
        postLoginRedirectUrl: `https://${process.env.VERCEL_URL}`,
        postLogoutRedirectUrl: `https://${process.env.VERCEL_URL}`,
      };
    }
  } else {
    return {};
  }
}

export const GET = handleAuth({ override: overrideConfig });
