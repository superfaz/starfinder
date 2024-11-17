import { start } from "chain-of-actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotFoundError } from "logic";
import { retrieveRaces } from "logic/server";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { preparePageContext, retrieveCharacter } from "../helpers-server";
import { createState } from "./actions";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection de la race",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await preparePageContext(`/edit/${params.character}/race`, IdSchema, params.character);
  if (!context.success) {
    return serverError(context.error);
  }

  const result = await start(context.value)
    .onSuccess((_, { input, dataSource, user }) => retrieveCharacter(input, dataSource, user))
    .onError((error) => {
      if (error instanceof NotFoundError) {
        return notFound();
      }
      return serverError(error);
    })
    .addData((_, context) => retrieveRaces(context))
    .onError(serverError)
    .runAsync();

  const initial = await createState(result.value.character);

  return <PageContent races={result.value.races} initial={initial} />;
}
