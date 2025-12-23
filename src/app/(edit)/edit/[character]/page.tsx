import { addDataGrouped, onSuccessGrouped, start, succeed } from "chain-of-actions";
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

  const data = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(({ input, dataSource, user }) => retrieveCharacter(input, dataSource, user)))
    .add(
      addDataGrouped(async ({ character, viewBuilder }) =>
        succeed({ view: await viewBuilder.createCharacterDetailed(character) })
      )
    )
    .add(addDataGrouped(({ character }) => succeed({ alerts: check(character) })))
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
