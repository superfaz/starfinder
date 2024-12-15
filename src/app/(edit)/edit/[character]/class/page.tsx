import { start } from "chain-of-actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotFoundError } from "logic";
import { retrieveClasses } from "logic/server";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { preparePageContext, retrieveCharacter } from "../helpers-server";
import { createState } from "./actions";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection de la classe",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await preparePageContext(`/edit/${params.character}/class`, IdSchema, params.character);
  if (!context.success) {
    return serverError(context.error);
  }

  const result = await start(context.value)
    .onSuccess(({ input, dataSource, user }) => retrieveCharacter(input, dataSource, user))
    .onError((error) => {
      if (error instanceof NotFoundError) {
        return notFound();
      }
      return serverError(error);
    })
    .addData(retrieveClasses)
    .onError(serverError)
    .runAsync();

  const initial = await createState(result.value.character);
  return <PageContent classes={result.value.classes} initial={initial} />;
}
