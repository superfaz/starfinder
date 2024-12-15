import { addData, onSuccess, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { characters, getAuthenticatedUser, getDataSource, getViewBuilder } from "logic/server";
import { serverError } from "navigation";
import { PageAuthenticated } from "./PageAuthenticated";
import { PageContent } from "./PageContent";

export default async function Page() {
  const user = await getAuthenticatedUser();

  if (!user.success) {
    // Display anonymous content
    return <PageContent />;
  }

  const context = await start()
    .add(onSuccess(() => succeed(user.value)))
    .add(addData(getDataSource))
    .add(addData(getViewBuilder))
    .runAsync();

  const values = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(characters.retrieveLast3Characters))
    .add(
      onSuccessGrouped(async ({ characters, viewBuilder }) => succeed(await viewBuilder.createCharacter(characters)))
    )
    .runAsync();

  if (!values.success) {
    return serverError(values.error);
  }

  return <PageAuthenticated characters={values.value} />;
}
