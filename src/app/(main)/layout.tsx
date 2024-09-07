import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import { LayoutAnonymous } from "./LayoutAnonymous";
import { LayoutAuthenticated } from "./LayoutAuthenticated";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) {
    return <LayoutAuthenticated>{children}</LayoutAuthenticated>;
  } else {
    return <LayoutAnonymous>{children}</LayoutAnonymous>;
  }
}
