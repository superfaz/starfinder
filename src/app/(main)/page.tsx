import { start, succeed } from "chain-of-actions";
import { DataSets } from "data";
import { getAuthenticatedUser, getDataSource } from "logic/server";
import { serverError } from "navigation";
import { ViewBuilder } from "view/server";
import { PageContent } from "./PageContent";
import { PageAuthenticated } from "./PageAuthenticated";

export default async function Page() {
  const user = await getAuthenticatedUser();

  if (!user.success) {
    return <PageContent />;
  }

  const context = await start()
    .onSuccess(() => succeed(user.value))
    .addData(getDataSource)
    .addData(({ dataSource }) => succeed({ viewBuilder: new ViewBuilder(dataSource) }))
    .runAsync();

  const characters = await start(context.value)
    .onSuccess((_, { dataSource, user }) =>
      dataSource.get(DataSets.Characters).find({ userId: user.id }, "updateOn", 3)
    )
    .onSuccess(async (characters, { viewBuilder }) => succeed(await viewBuilder.createCharacter(characters)))
    .runAsync();

  if (!characters.success) {
    return serverError(characters.error);
  }

  return <PageAuthenticated characters={characters.value} />;
}
