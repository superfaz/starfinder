import handleAuth from "./auth";

async function overrideConfig() {
  if (process.env.VERCEL && process.env.VERCEL_ENV === "production") {
    // Deployment to vercel production
    return { siteUrl: `https://${process.env.VERCEL_URL}` };
  } else {
    return {};
  }
}

export const GET = handleAuth({ override: overrideConfig });
