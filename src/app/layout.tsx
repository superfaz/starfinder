import React from "react";
import { Metadata } from "next";
import { DataSets, DataSource } from "data";
import { IStaticData } from "logic/StaticContext";
import { LayoutClient } from "./LayoutClient";

import "./site.scss";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "starfinder · monperso.fr", template: "%s · starfinder · monperso.fr" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const dataSource = new DataSource();

  const loadData = await Promise.all([
    dataSource.get(DataSets.AbilityScore).getAll(),
    dataSource.get(DataSets.ArmorType).getAll(),
    dataSource.get(DataSets.Avatar).getAll(),
    dataSource.get(DataSets.DamageTypes).getAll(),
    dataSource.get(DataSets.Sizes).getAll(),
    dataSource.get(DataSets.Book).getAll(),
    dataSource.get(DataSets.WeaponTypes).getAll(),
    dataSource.get(DataSets.Skills).getAll(),
  ]);

  if (loadData.some((d) => !d.success)) {
    const errors = loadData.filter((d) => !d.success).map((d) => d.error);
    throw errors[0];
  }

  const data: IStaticData = {
    abilityScores: loadData[0].success ? loadData[0].value : [],
    armorTypes: loadData[1].success ? loadData[1].value : [],
    avatars: loadData[2].success ? loadData[2].value : [],
    damageTypes: loadData[3].success ? loadData[3].value : [],
    sizes: loadData[4].success ? loadData[4].value : [],
    books: loadData[5].success ? loadData[5].value : [],
    weaponTypes: loadData[6].success ? loadData[6].value : [],
    skills: loadData[7].success ? loadData[7].value : [],
  };

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
      <body style={{ paddingTop: "5rem", paddingBottom: "4rem" }}>
        {process.env.NODE_ENV === "development" && (
          <div className="fixed-top ps-2 pt-1" style={{ right: "auto", zIndex: 10000 }}>
            <div className="d-block d-sm-none">xs</div>
            <div className="d-none d-sm-block d-md-none">sm</div>
            <div className="d-none d-md-block d-lg-none">md</div>
            <div className="d-none d-lg-block d-xl-none">lg</div>
            <div className="d-none d-xl-block d-xxl-none">xl</div>
            <div className="d-none d-xxl-block">xxl</div>
          </div>
        )}
        <LayoutClient data={data}>{children}</LayoutClient>
      </body>
    </html>
  );
}
