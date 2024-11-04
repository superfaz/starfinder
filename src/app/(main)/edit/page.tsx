import { Metadata } from "next";
import { start, succeed } from "chain-of-actions";
import { DataSets } from "data";
import { UnauthorizedError } from "logic";
import { getAuthenticatedUser, getDataSource, getViewBuilder, redirectToSignIn } from "logic/server";
import { serverError, unauthorized } from "navigation";
import { PageContent } from "./PageContent";
import { Character } from "model";

export const metadata: Metadata = {
  title: "Personnages",
};

export default async function Page() {
  const context = await start()
    .onSuccess(getAuthenticatedUser)
    .onError(() => redirectToSignIn(`/edit`))
    .addData(getDataSource)
    .addData(getViewBuilder)
    .runAsync();

  if (!context.success) {
    return serverError(context.error);
  }

  const characters = await start(undefined, context.value)
    .onSuccess((_, { user, dataSource }) => dataSource.get(DataSets.Characters).find({ userId: user.id }))
    .onSuccess(async (characters, { viewBuilder }) =>
      succeed(await viewBuilder.createCharacter(characters as Character[]))
    )
    .runAsync();

  if (!characters.success) {
    if (characters.error instanceof UnauthorizedError) {
      return unauthorized();
    } else {
      return serverError(characters.error);
    }
  }

  return <PageContent characters={characters.value} />;
}
