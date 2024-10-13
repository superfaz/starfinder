import { Metadata } from "next";
import { Result, start, succeed } from "chain-of-actions";
import { DataSets } from "data";
import { PageContent } from "./PageContent";
import { getAuthenticatedUser, getDataSource, getViewBuilder, redirectToSignIn } from "logic/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";

export const metadata: Metadata = {
  title: "Création",
};

function getData<T, E extends Error>(result: Result<T[], E>) {
  return result.success ? result.data : [];
}

export default async function Page() {
  const context = await start()
    .onSuccess(getAuthenticatedUser)
    .onError<
      {
        user: KindeUser<Record<string, unknown>>;
      },
      never
    >(() => redirectToSignIn(`/create`))
    .addData(getDataSource)
    .addData(getViewBuilder)
    .runAsync();

  if (!context.success) {
    // 500
    throw new Error("Failed to load context", context.error);
  }

  const data = await Promise.all([
    start(undefined, context.data)
      .onSuccess((_, { dataSource }) => dataSource.get(DataSets.Races).getAll())
      .onSuccess((races, { viewBuilder }) => succeed(viewBuilder.createRaceEntry(races)))
      .runAsync(),
    start(undefined, context.data)
      .onSuccess((_, { dataSource }) => dataSource.get(DataSets.Themes).getAll())
      .onSuccess((themes, { viewBuilder }) => succeed(viewBuilder.createEntry(themes)))
      .runAsync(),
    start(undefined, context.data)
      .onSuccess((_, { dataSource }) => dataSource.get(DataSets.Class).getAll())
      .onSuccess((classes, { viewBuilder }) => succeed(viewBuilder.createEntry(classes)))
      .runAsync(),
  ]);

  if (data.some((d) => !d.success)) {
    // 500
    throw new Error("Failed to load data");
  }

  return <PageContent races={getData(data[0])} themes={getData(data[1])} classes={getData(data[2])} />;
}
