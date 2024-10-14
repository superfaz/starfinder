import { Metadata } from "next";
import { start, succeed } from "chain-of-actions";
import { DataSets } from "data";
import { UnauthorizedError } from "logic";
import { getAuthenticatedUser, getDataSource, getViewBuilder, redirectToSignIn } from "logic/server";
import { PageContent } from "./PageContent";

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
    // 500
    throw new Error("Failed to load context", context.error);
  }

  const characters = await start(undefined, context.value)
    .onSuccess((_, { user, dataSource }) => dataSource.get(DataSets.Characters).find({ userId: user.id }))
    .onSuccess(async (characters, { viewBuilder }) => succeed(await viewBuilder.createCharacter(characters)))
    .runAsync();

  if (!characters.success) {
    if (characters.error instanceof UnauthorizedError) {
      // TODO 401
      throw new Error("Unauthorized", characters.error);
    } else {
      // TODO 500
      throw new Error("Failed to load characters", characters.error);
    }
  }

  return <PageContent characters={characters.value} />;
}
