import { NextResponse } from "next/server";
import RouterClient from "./RouterClient";

export const logout = async (routerClient: RouterClient): Promise<NextResponse> => {
  const authUrl = await routerClient.kindeClient.logout(routerClient.sessionManager);

  const postLogoutRedirectURL = routerClient.getSearchParam("post_logout_redirect_url");

  if (postLogoutRedirectURL) {
    await routerClient.sessionManager.setSessionItem("post_logout_redirect_url", postLogoutRedirectURL);
  }

  return NextResponse.redirect(authUrl.toString());
};
