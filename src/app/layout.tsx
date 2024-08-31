import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import { Metadata } from "next";
import { LayoutAnonymous } from "./LayoutAnonymous";
import { LayoutAuthenticated } from "./LayoutAuthenticated";

import "./site.scss";

export const metadata: Metadata = {
  title: { default: "starfinder · monperso.fr", template: "%s · starfinder · monperso.fr" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <html lang="fr" data-bs-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* eslint-disable-next-line @next/next/google-font-display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa&family=Orbitron&display=block"
          rel="stylesheet"
        />
      </head>
      <body>
        {process.env.NODE_ENV === "development" && (
          <div className="fixed-top ms-1" style={{ right: "auto" }}>
            <div className="d-block d-sm-none">xs</div>
            <div className="d-none d-sm-block d-md-none">sm</div>
            <div className="d-none d-md-block d-lg-none">md</div>
            <div className="d-none d-lg-block d-xl-none">lg</div>
            <div className="d-none d-xl-block d-xxl-none">xl</div>
            <div className="d-none d-xxl-block">xxl</div>
          </div>
        )}
        {isUserAuthenticated && <LayoutAuthenticated>{children}</LayoutAuthenticated>}
        {!isUserAuthenticated && <LayoutAnonymous>{children}</LayoutAnonymous>}
      </body>
    </html>
  );
}
