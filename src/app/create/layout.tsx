import { ReactNode } from "react";
import { DataSetBuilder, IClientDataSet, IDataSet, convert } from "data";
import LayoutClient from "./layout-client";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const builder = new DataSetBuilder();
  const serverData: IDataSet = await builder.build();
  const clientData: IClientDataSet = await convert(serverData);
  return <LayoutClient data={clientData}>{children}</LayoutClient>;
}
