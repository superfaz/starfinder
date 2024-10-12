import React from "react";
import { getAuthenticatedUser } from "logic/server";
import { LayoutAnonymous } from "./LayoutAnonymous";
import { LayoutAuthenticated } from "./LayoutAuthenticated";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getAuthenticatedUser();

  if (!user.success) {
    return <LayoutAnonymous>{children}</LayoutAnonymous>;
  }

  return <LayoutAuthenticated>{children}</LayoutAuthenticated>;
}
