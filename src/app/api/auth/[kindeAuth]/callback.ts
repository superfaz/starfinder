import { NextResponse } from "next/server";
import RouterClient from "./RouterClient";

export const callback = async (routerClient: RouterClient): Promise<NextResponse> => {
  const postLoginRedirectURLFromMemory = (await routerClient.sessionManager.getSessionItem<string>(
    "post_login_redirect_url"
  )) as string | null;

  if (postLoginRedirectURLFromMemory) {
    routerClient.sessionManager.removeSessionItem("post_login_redirect_url");
  }

  if (postLoginRedirectURLFromMemory && typeof postLoginRedirectURLFromMemory !== "string") {
    return NextResponse.json({ error: "Invalid post_login_redirect_url" }, { status: 500 });
  }

  let postLoginRedirectURL = postLoginRedirectURLFromMemory ?? routerClient.config.postLoginRedirectUrl;
  if (!postLoginRedirectURL) {
    postLoginRedirectURL = routerClient.config.siteUrl;
  } else if (!postLoginRedirectURL.startsWith("http")) {
    postLoginRedirectURL = routerClient.config.siteUrl + postLoginRedirectURL;
  }

  try {
    await routerClient.kindeClient.handleRedirectToApp(routerClient.sessionManager, routerClient.url);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error }, { status: 500 });
    }
  }

  return NextResponse.redirect(postLoginRedirectURL);
};
