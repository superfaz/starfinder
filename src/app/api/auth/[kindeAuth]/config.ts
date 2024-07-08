import { GrantType } from "@kinde-oss/kinde-typescript-sdk";
import { HandleAuthConfig, HandleAuthOptions, ClientOptions } from "./types";

function removeTrailingSlash(url: string | undefined | null) {
  if (url === undefined || url === null) return undefined;

  url = url.trim();

  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  return url;
}

let singletonConfig: HandleAuthConfig | null = null;
async function initConfig(options?: HandleAuthOptions) {
  const override: ClientOptions = (await options?.override?.()) ?? {};
  const clientOptions: ClientOptions = { ...options?.clientOptions, ...override };

  const KINDE_DEBUG_MODE = process.env.KINDE_DEBUG_MODE === "true";

  // We need to use NEXT_PUBLIC for frontend vars
  const KINDE_AUTH_API_PATH =
    removeTrailingSlash(process.env.NEXT_PUBLIC_KINDE_AUTH_API_PATH) ??
    removeTrailingSlash(process.env.KINDE_AUTH_API_PATH) ??
    "/api/auth";

  const KINDE_COOKIE_DOMAIN = removeTrailingSlash(process.env.KINDE_COOKIE_DOMAIN);

  const KINDE_POST_LOGIN_REDIRECT_URL =
    removeTrailingSlash(clientOptions.postLoginRedirectUrl) ??
    removeTrailingSlash(process.env.KINDE_POST_LOGIN_REDIRECT_URL);
  const KINDE_POST_LOGOUT_REDIRECT_URL =
    removeTrailingSlash(clientOptions.postLogoutRedirectUrl) ??
    removeTrailingSlash(process.env.KINDE_POST_LOGOUT_REDIRECT_URL);

  const KINDE_SITE_URL = removeTrailingSlash(clientOptions.siteUrl) ?? removeTrailingSlash(process.env.KINDE_SITE_URL);

  const KINDE_ISSUER_URL =
    removeTrailingSlash(clientOptions.issuerURL) ?? removeTrailingSlash(process.env.KINDE_ISSUER_URL);

  const KINDE_CLIENT_ID = clientOptions.clientId ?? process.env.KINDE_CLIENT_ID;
  const KINDE_CLIENT_SECRET = clientOptions.clientSecret ?? process.env.KINDE_CLIENT_SECRET;
  const KINDE_AUDIENCE = clientOptions.audience ?? process.env.KINDE_AUDIENCE?.split(" ");

  singletonConfig = {
    onError: options?.onError,
    isDebugMode: KINDE_DEBUG_MODE,
    grantType: GrantType.AUTHORIZATION_CODE,
    apiPath: KINDE_AUTH_API_PATH,
    cookieDomain: KINDE_COOKIE_DOMAIN,
    siteUrl: KINDE_SITE_URL ?? "",
    issuerURL: KINDE_ISSUER_URL,
    postLoginRedirectUrl: KINDE_POST_LOGIN_REDIRECT_URL,
    postLogoutRedirectUrl: KINDE_POST_LOGOUT_REDIRECT_URL,
    clientConfig: {
      audience: KINDE_AUDIENCE ?? "",
      authDomain: KINDE_ISSUER_URL ?? "",
      clientId: KINDE_CLIENT_ID ?? "",
      clientSecret: KINDE_CLIENT_SECRET ?? "",
      logoutRedirectURL: KINDE_POST_LOGOUT_REDIRECT_URL ?? "",
      redirectURL: `${KINDE_SITE_URL}/api/auth/kinde_callback`,
      frameworkVersion: "2.3.3",
      framework: "Next.js",
    },
  };
}

export async function getConfig(options?: HandleAuthOptions): Promise<HandleAuthConfig> {
  if (!singletonConfig) {
    await initConfig(options);
  }

  if (!singletonConfig) {
    throw new Error("Failed to initialize config");
  }

  return singletonConfig;
}
