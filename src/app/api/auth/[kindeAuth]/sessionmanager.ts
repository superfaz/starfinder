import { SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { HandleAuthConfig } from "./types";

const TWENTY_NINE_DAYS = 2505600;

const COOKIE_LIST = [
  "id_token_payload",
  "id_token",
  "access_token_payload",
  "access_token",
  "user",
  "refresh_token",
  "post_login_redirect_url",
];

export const GLOBAL_COOKIE_OPTIONS: Partial<ResponseCookie> = {
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export const appRouterSessionManager = (
  cookieStore: ReadonlyRequestCookies,
  config: HandleAuthConfig
): SessionManager => ({
  getSessionItem: async (itemKey) => {
    const item = cookieStore.get(itemKey);
    if (item) {
      try {
        const jsonValue = JSON.parse(item.value);
        if (typeof jsonValue === "object") {
          return jsonValue;
        }
        return item.value;
      } catch (error) {
        return item.value;
      }
    }
    return null;
  },

  setSessionItem: async (itemKey, itemValue) => {
    if (itemValue !== undefined) {
      cookieStore.set(itemKey, typeof itemValue === "string" ? itemValue : JSON.stringify(itemValue), {
        maxAge: TWENTY_NINE_DAYS,
        domain: config.cookieDomain,
        ...GLOBAL_COOKIE_OPTIONS,
      });
    }
  },

  removeSessionItem: async (itemKey) => {
    cookieStore.set(itemKey, "", {
      domain: config.cookieDomain,
      maxAge: 0,
      ...GLOBAL_COOKIE_OPTIONS,
    });
  },

  destroySession: async () => {
    COOKIE_LIST.forEach((name) =>
      cookieStore.set(name, "", {
        domain: config.cookieDomain,
        maxAge: 0,
        ...GLOBAL_COOKIE_OPTIONS,
      })
    );
  },
});
