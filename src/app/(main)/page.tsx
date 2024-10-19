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

  const characters = await start(user.value)
    .addData(() => getDataSource())
    .addData(({ dataSource }) => succeed(new ViewBuilder(dataSource)))
    .onSuccess(({ dataSource, user }) => dataSource.get(DataSets.Characters).find({ userId: user.id }, "updateOn", 3))
    .runAsync();

  if (!characters.success) {
    return serverError(characters.error);
  }

  return <PageAuthenticated characters={characters.value} />;
}
