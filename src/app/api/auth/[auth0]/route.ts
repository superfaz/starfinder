import { handleAuth } from "@auth0/nextjs-auth0";

if (!process.env.AUTH0_BASE_URL) {
  process.env.AUTH0_BASE_URL = process.env.VERCEL_URL ?? process.env.BASE_URL ?? "http://localhost:3000";
  console.error("AUTH0_BASE_URL is not set, defaulting to", process.env.AUTH0_BASE_URL);
}

export const GET = handleAuth();
