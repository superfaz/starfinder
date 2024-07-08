import type { ACClient, ACClientOptions, SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import { createKindeServerClient } from "@kinde-oss/kinde-typescript-sdk";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { appRouterSessionManager } from "./sessionmanager";
import type { HandleAuthConfig } from "./types";

class RouterClient {
  constructor(req: NextRequest, config: HandleAuthConfig) {
    this.config = config;
    this.clientConfig = config.clientConfig;
    this.kindeClient = createKindeServerClient(config.grantType, config.clientConfig);
    this.url = new URL(req.url);
    this.sessionManager = appRouterSessionManager(cookies(), config);
    this.req = req;
    this.searchParams = req.nextUrl.searchParams;
    this.onErrorCallback = config.onError;
  }

  config: HandleAuthConfig;
  clientConfig: ACClientOptions;
  kindeClient: ACClient;
  url: URL;
  sessionManager: SessionManager;
  req: NextRequest;
  searchParams: URLSearchParams;
  onErrorCallback?: () => void;

  getSearchParam(key: string): string | null {
    return this.req.nextUrl.searchParams.get(key);
  }
}

export default RouterClient;
