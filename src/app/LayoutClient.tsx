"use client";

import { StaticContext, type IStaticData } from "logic/StaticContext";

export function LayoutClient({ data, children }: Readonly<{ data: IStaticData; children?: React.ReactNode }>) {
  return <StaticContext.Provider value={data}>{children}</StaticContext.Provider>;
}
