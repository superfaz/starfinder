import { start, succeed } from "chain-of-actions";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { NotFoundError, UnauthorizedError } from "logic";
import { check } from "logic/server";
import { IdSchema } from "model";
import { serverError, unauthorized } from "navigation";
import { preparePageContext, retrieveCharacter } from "./helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Création",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await preparePageContext(`/edit/${params.character}`, IdSchema, params.character);
  if (!context.success) {
    return serverError(context.error);
  }

  const data = await start(context.value)
    .onSuccess(({ input, dataSource, user }) => retrieveCharacter(input, dataSource, user))
    .addData(async ({ character, viewBuilder }) =>
      succeed({ view: await viewBuilder.createCharacterDetailed(character) })
    )
    .addData(({ character }) => succeed({ alerts: check(character) }))
    .runAsync();

  if (!data.success) {
    if (data.error instanceof NotFoundError) {
      return notFound();
    } else if (data.error instanceof UnauthorizedError) {
      return unauthorized();
    } else {
      return serverError(data.error);
    }
  }

  // Render the page
  return <PageContent character={data.value.view} alerts={data.value.alerts} />;
}
