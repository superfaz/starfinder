import handleAuth from "./auth";

async function overrideConfig() {
  return {
    siteUrl: "http://localhost:3000",
  };
}

export const GET = handleAuth({ override: overrideConfig });
