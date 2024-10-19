import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { DataSource, IDataSource, convert } from "data";
import { NotFoundError } from "logic";
import { Character, IModel } from "model";
import { retrieveCharacter } from "./helpers-server";
import LayoutClient from "./layout-client";
import { serverError } from "navigation";
import { start } from "chain-of-actions";
import { getAuthenticatedUser, getDataSource } from "logic/server";

export const dynamic = "force-dynamic";

async function LayoutServer({
  children,
  character,
  classesDetails,
}: Readonly<{ children: ReactNode; character?: Character; classesDetails?: Record<string, IModel> }>) {
  const dataSource: IDataSource = new DataSource();
  const clientData = await convert(dataSource);
  const debug = process.env.STARFINDER_DEBUG === "true";

  if (character === undefined) {
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
  const context = await start().onSuccess(getDataSource).addData(getAuthenticatedUser).runAsync();

  if (!context.success) {
    return serverError(context.error);
  }

  const result = await retrieveCharacter(params.character, context.value.dataSource, context.value.user);
  if (!result.success) {
    if (result.error instanceof NotFoundError) {
      return notFound();
    } else {
      return serverError(result.error);
    }
  }

  return await LayoutServer({ children, character: result.value.character });
}
