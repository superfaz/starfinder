import { Metadata } from "next";
import { addData, onError, onSuccess, onSuccessGrouped, Result, start, succeed } from "chain-of-actions";
import {
  classes,
  getAuthenticatedUser,
  getDataSource,
  getViewBuilder,
  races,
  redirectToSignIn,
  themes,
} from "logic/server";
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
    .add(onSuccess(getAuthenticatedUser))
    .add(onError(() => redirectToSignIn(`/create`)))
    .add(addData(getDataSource))
    .add(addData(getViewBuilder))
    .runAsync();

  const data = await Promise.all([
    start()
      .withContext(context.value)
      .add(onSuccessGrouped(races.retrieveAll))
      .add(onSuccessGrouped(({ races, viewBuilder }) => succeed(viewBuilder.createRaceEntry(races))))
      .runAsync(),
    start()
      .withContext(context.value)
      .add(onSuccessGrouped(themes.retrieveAll))
      .add(onSuccessGrouped(({ themes, viewBuilder }) => succeed(viewBuilder.createEntry(themes))))
      .runAsync(),
    start()
      .withContext(context.value)
      .add(onSuccessGrouped(classes.retrieveAll))
      .add(onSuccessGrouped(({ classes, viewBuilder }) => succeed(viewBuilder.createEntry(classes))))
      .runAsync(),
  ]);

  if (data.some((d) => !d.success)) {
    return serverError(data.find((d) => !d.success)!.error);
  }

  return <PageContent races={getData(data[0])} themes={getData(data[1])} classes={getData(data[2])} />;
}
