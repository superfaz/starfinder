import { handleAuth } from "@auth0/nextjs-auth0";

if (!process.env.AUTH0_BASE_URL) {
  if (process.env.VERCEL_URL) {
    process.env.AUTH0_BASE_URL = `https://${process.env.VERCEL_URL}`;
    console.info("AUTH0_BASE_URL is not set, using Vercel context", process.env.AUTH0_BASE_URL);
  } else {
    process.env.AUTH0_BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
    console.info("AUTH0_BASE_URL is not set, defaulting to", process.env.AUTH0_BASE_URL);
  }
}

export const GET = handleAuth();
