import { ReactNode } from "react";
import { DataSetBuilder, IClientDataSet, IDataSet, convert } from "data";
import LayoutClient from "./layout-client";
import { Character, IModel } from "model";

export const dynamic = "force-dynamic";

export async function LayoutServer({
  children,
  character,
  classesDetails,
}: Readonly<{ children: ReactNode; character?: Character; classesDetails?: Record<string, IModel> }>) {
  const builder = new DataSetBuilder();
  const serverData: IDataSet = await builder.build();
  const clientData: IClientDataSet = await convert(serverData);
  const debug = process.env.STARFINDER_DEBUG === "true";

  return (
    <LayoutClient debug={debug} character={character} classesDetails={classesDetails} data={clientData}>
      {children}
    </LayoutClient>
  );
}

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return await LayoutServer({ children });
}
