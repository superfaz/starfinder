import { NextRequest, NextResponse } from "next/server";
import { callback } from "./callback";
import { getConfig } from "./config";
import { health } from "./health";
import { login } from "./login";
import { logout } from "./logout";
import RouterClient from "./RouterClient";
import { setup } from "./setup";
import { HandleAuthConfig, HandleAuthOptions } from "./types";

const routeMap: Record<string, (routerClient: RouterClient) => Promise<NextResponse>> = {
  login,
  logout,
  health,
  setup,
  kinde_callback: callback,
};

const getRoute = (endpoint: string) => {
  return routeMap[endpoint];
};

async function appRouterHandler(
  req: NextRequest,
  context: { params: { kindeAuth: string } },
  config: HandleAuthConfig
) {
  const endpoint = context.params.kindeAuth;
  const route = getRoute(endpoint);

  return route
    ? await route(new RouterClient(req, config))
    : new Response("This page could not be found.", { status: 404 });
}

export default function handleAuth(
  options?: HandleAuthOptions
): (req: NextRequest, context: { params: { kindeAuth: string } }) => Promise<Response> {
  return async function handler(req: NextRequest, context: { params: { kindeAuth: string } }) {
    const config: HandleAuthConfig = await getConfig(options);

    if (!config.clientConfig.authDomain)
      throw new Error("The environment variable 'KINDE_ISSUER_URL' is required. Set it in your .env file");

    if (!config.clientConfig.clientId)
      throw new Error("env variable 'KINDE_CLIENT_ID' is not set and not passed in options");

    if (!config.clientConfig.clientSecret)
      throw new Error("env variable 'KINDE_CLIENT_SECRET' is not set and not passed in options");

    if (!config.siteUrl)
      throw new Error("env variable 'KINDE_SITE_URL' is not set and not passed in options");

    return appRouterHandler(req, context, config);
  };
}
