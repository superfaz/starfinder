import { initAuth0 } from "@auth0/nextjs-auth0";

let baseURL = process.env.AUTH0_BASE_URL;
if (!baseURL && process.env.VERCEL_URL) {
  baseURL = `https://${process.env.VERCEL_URL}`;
}

export default initAuth0({ baseURL });
