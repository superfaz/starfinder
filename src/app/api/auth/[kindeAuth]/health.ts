import { validateClientSecret } from "@kinde-oss/kinde-typescript-sdk";
import { NextResponse } from "next/server";
import RouterClient from "./RouterClient";

export const health = async (routerClient: RouterClient): Promise<NextResponse> => {
  const config = routerClient.config;
  return NextResponse.json({
    apiPath: config.apiPath,
    redirectURL: config.clientConfig.redirectURL,
    postLoginRedirectUrl: config.postLoginRedirectUrl,
    issuerURL: config.issuerURL,
    clientID: config.clientConfig.clientId,
    clientSecret: validateClientSecret(config.clientConfig.clientSecret ?? "") ? "Set correctly" : "Not set correctly",
    postLogoutRedirectUrl: config.postLogoutRedirectUrl,
    audience: config.clientConfig.audience,
    cookieDomain: config.cookieDomain,
    logoutRedirectURL: config.clientConfig.logoutRedirectURL,
  });
};
