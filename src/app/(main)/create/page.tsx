import { Metadata } from "next";
import { Result, start, succeed } from "chain-of-actions";
import { DataSets } from "data";
import { getAuthenticatedUser, getDataSource, getViewBuilder, redirectToSignIn } from "logic/server";
import { serverError } from "navigation";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Création",
};

function getData<T, E extends Error>(result: Result<T[], E>) {
  return result.success ? result.value : [];
}

export default async function Page() {
  const context = await start()
    .onSuccess(getAuthenticatedUser)
    .onError(() => redirectToSignIn(`/create`))
    .addData(getDataSource)
    .addData(getViewBuilder)
    .runAsync();

  const data = await Promise.all([
    start(context.value)
      .onSuccess((_, { dataSource }) => dataSource.get(DataSets.Races).getAll())
      .onSuccess((races, { viewBuilder }) => succeed(viewBuilder.createRaceEntry(races)))
      .runAsync(),
    start(context.value)
      .onSuccess((_, { dataSource }) => dataSource.get(DataSets.Themes).getAll())
      .onSuccess((themes, { viewBuilder }) => succeed(viewBuilder.createEntry(themes)))
      .runAsync(),
    start(context.value)
      .onSuccess((_, { dataSource }) => dataSource.get(DataSets.Class).getAll())
      .onSuccess((classes, { viewBuilder }) => succeed(viewBuilder.createEntry(classes)))
      .runAsync(),
  ]);

  if (data.some((d) => !d.success)) {
    return serverError(data.find((d) => !d.success)!.error);
  }

  return <PageContent races={getData(data[0])} themes={getData(data[1])} classes={getData(data[2])} />;
}
