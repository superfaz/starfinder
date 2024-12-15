import { Metadata } from "next";
import { addData, onError, onSuccess, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { UnauthorizedError } from "logic";
import { characterService, getAuthenticatedUser, getDataSource, getViewBuilder, redirectToSignIn } from "logic/server";
import { serverError, unauthorized } from "navigation";
import { PageContent } from "./PageContent";
import { Character } from "model";

export const metadata: Metadata = {
  title: "Personnages",
};

export default async function Page() {
  const context = await start()
    .add(onSuccess(getAuthenticatedUser))
    .add(onError(() => redirectToSignIn(`/edit`)))
    .add(addData(getDataSource))
    .add(addData(getViewBuilder))
    .runAsync();

  const characters = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(characterService.retrieveAllForUser))
    .add(
      onSuccess(async (characters, { viewBuilder }) =>
        succeed(await viewBuilder.createCharacter(characters as Character[]))
      )
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
