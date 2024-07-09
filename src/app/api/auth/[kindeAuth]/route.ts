import handleAuth from "./auth";
import { ClientOptions } from "./types";

async function overrideConfig(): Promise<ClientOptions> {
  if (process.env.VERCEL && process.env.VERCEL_ENV === "production") {
    // Deployment to vercel production
    return {
      siteUrl: `https://${process.env.VERCEL_URL}`,
      postLoginRedirectUrl: `https://${process.env.VERCEL_URL}`,
      postLogoutRedirectUrl: `https://${process.env.VERCEL_URL}`,
    };
  } else {
    return {};
  }
}

export const GET = handleAuth({ override: overrideConfig });
