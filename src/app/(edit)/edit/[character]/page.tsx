import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { NotFoundError, ParsingError, UnauthorizedError } from "logic";
import {
  check,
  getAuthenticatedUser,
  getDataSource,
  getViewBuilder,
  hasValidInput,
  redirectToSignIn,
} from "logic/server";
import { retrieveCharacter } from "./helpers-server";
import { PageContent } from "./PageContent";
import { start, succeed } from "chain-of-actions";
import { IdSchema } from "model";

export const metadata: Metadata = {
  title: "Création",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await start()
    .onSuccess(getAuthenticatedUser)
    .onError(() => redirectToSignIn(`/edit/${params.character}`))
    .addData(() => hasValidInput(IdSchema, params.character))
    .addData(getDataSource)
    .addData(getViewBuilder)
    .runAsync();

  if (!context.success) {
    if (context.error instanceof ParsingError) {
      // 400
      throw new Error("Invalid input");
    }

    // 500
    throw new Error("Failed to load context", context.error);
  }

  const data = await start(undefined, context.value)
    .onSuccess((_, { data }) => retrieveCharacter(data))
    .onSuccess((character) => succeed({ character }))
    .addData(async ({ character }, { viewBuilder }) =>
      succeed({ view: await viewBuilder.createCharacterDetailed(character) })
    )
    .addData(({ character }) => succeed({ alerts: check(character) }))
    .runAsync();

  if (!data.success) {
    if (data.error instanceof NotFoundError) {
      return notFound();
    } else if (data.error instanceof UnauthorizedError) {
      // 401
      throw new Error("Unauthorized");
    } else {
      // 500
      throw new Error("Failed to load data", data.error);
    }
  }

  // Render the page
  return <PageContent character={data.value.view} alerts={data.value.alerts} />;
}
