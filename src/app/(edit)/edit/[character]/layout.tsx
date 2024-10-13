import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { DataSource, IDataSource, convert } from "data";
import { NotFoundError } from "logic";
import { Character, IModel } from "model";
import { retrieveCharacter } from "./helpers-server";
import LayoutClient from "./layout-client";

export const dynamic = "force-dynamic";

export async function LayoutServer({
  children,
  character,
  classesDetails,
}: Readonly<{ children: ReactNode; character?: Character; classesDetails?: Record<string, IModel> }>) {
  const dataSource: IDataSource = new DataSource();
  const clientData = await convert(dataSource);
  const debug = process.env.STARFINDER_DEBUG === "true";

  if (character === undefined) {
    // 404
    return notFound();
  }

  return (
    <LayoutClient debug={debug} character={character} classesDetails={classesDetails} data={clientData}>
      {children}
    </LayoutClient>
  );
}

export default async function Layout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: { character: string } }>) {
  const result = await retrieveCharacter(params.character);
  if (!result.success) {
    if (result.error instanceof NotFoundError) {
      // 404
      return notFound();
    } else {
      // 500
      throw new Error("Unexpected error");
    }
  }

  return await LayoutServer({ children, character: result.data });
}
