import { start } from "chain-of-actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotFoundError } from "logic";
import { retrieveThemes } from "logic/server";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { preparePageContext, retrieveCharacter } from "../helpers-server";
import { PageContent } from "./PageContent";
import { createState } from "./actions";

export const metadata: Metadata = {
  title: "Sélection du thème",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await preparePageContext(`/edit/${params.character}/theme`, IdSchema, params.character);

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
    .addData((_, context) => retrieveThemes(context))
    .onError(serverError)
    .runAsync();

  if (!result.success) {
    return serverError(result.error);
  }

  const initial = await createState(result.value.character);

  return <PageContent themes={result.value.themes} initial={initial} />;
}
