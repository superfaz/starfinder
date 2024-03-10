import { ReactNode } from "react";
import { DataSetBuilder, IClientDataSet, IDataSet, convert } from "data";
import LayoutClient from "./layout-client";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const builder = new DataSetBuilder();
  const serverData: IDataSet = await builder.build();
  const clientData: IClientDataSet = await convert(serverData);
  const debug = process.env.STARFINDER_DEBUG === "true";

  return (
    <LayoutClient debug={debug} data={clientData}>
      {children}
    </LayoutClient>
  );
}
