import { ReactNode } from "react";
import { DataSource, IDataSource, convert } from "data";
import { Character, IModel } from "model";
import LayoutClient from "./layout-client";

export async function LayoutTest({
  children,
  character,
  classesDetails,
}: Readonly<{ children: ReactNode; character?: Character; classesDetails?: Record<string, IModel> }>) {
  const dataSource: IDataSource = new DataSource();
  const clientData = await convert(dataSource);
  const debug = process.env.STARFINDER_DEBUG === "true";

  if (character === undefined) {
    return null;
  }

  return (
    <LayoutClient debug={debug} character={character} classesDetails={classesDetails} data={clientData}>
      {children}
    </LayoutClient>
  );
}
