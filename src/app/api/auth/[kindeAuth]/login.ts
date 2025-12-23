import { NextResponse } from "next/server";
import RouterClient from "./RouterClient";

export const login = async (routerClient: RouterClient): Promise<NextResponse> => {
  const authUrl = await routerClient.kindeClient.login(routerClient.sessionManager, {
    authUrlParams: Object.fromEntries(routerClient.searchParams),
  });

  const postLoginRedirectURL = routerClient.getSearchParam("post_login_redirect_url");

  if (postLoginRedirectURL) {
    routerClient.sessionManager.setSessionItem("post_login_redirect_url", postLoginRedirectURL);
  }

  return NextResponse.redirect(authUrl.toString());
};
