import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DataSets, IDataSource } from "data";
import { prepareContext, retrieveCharacter } from "../helpers-server";
import { createState } from "./actions";
import { PageContent } from "./PageContent";
import { DataSourceError, NotFoundError } from "logic";
import { IdSchema, Race } from "model";
import { serverError } from "navigation";
import { PromisedResult, start, succeed } from "chain-of-actions";
import { fail } from "assert";

export const metadata: Metadata = {
  title: "Sélection de la race",
};

async function getRaces(dataSource: IDataSource): PromisedResult<{ races: Race[] }, DataSourceError> {
  const races = await dataSource.get(DataSets.Races).getAll();
  if (races.success) {
    return succeed({ races: races.value });
  } else {
    return fail(races.error);
  }
}

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await prepareContext(`/edit/${params.character}/race`, IdSchema, params.character);
  if (!context.success) {
    return serverError(context.error);
  }

  const result = await start(undefined, context.value)
    .onSuccess((_, { input, dataSource, user }) => retrieveCharacter(input, dataSource, user))
    .onError((error) => {
      if (error instanceof NotFoundError) {
        return notFound();
      }
      return serverError(error);
    })
    .addData((_, { dataSource }) => getRaces(dataSource))
    .onError(serverError)
    .runAsync();

  if (!result.success) {
    return serverError(result.error);
  }

  const initial = await createState(result.value.character);

  return <PageContent races={result.value.races} initial={initial} />;
}
