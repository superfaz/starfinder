import { DataSets } from "data";
import { ViewBuilder } from "view/server";
import { PageContent } from "./PageContent";
import { PageAuthenticated } from "./PageAuthenticated";
import { start, succeed } from "chain-of-actions";
import { getAuthenticatedUser, getDataSource } from "logic/server";

export default async function Page() {
  const user = await getAuthenticatedUser();

  if (!user.success) {
    return <PageContent />;
  } else {
    const characters = await start(user.data)
      .addData(() => getDataSource())
      .addData(({ dataSource }) => succeed(new ViewBuilder(dataSource)))
      .onSuccess(({ dataSource, user }) => dataSource.get(DataSets.Characters).find({ userId: user.id }, "updateOn", 3))
      .runAsync();

    if (!characters.success) {
      throw new Error("Failed to load characters", characters.error);
    } else {
      return <PageAuthenticated characters={characters.data} />;
    }
  }
}
