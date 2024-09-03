import { Metadata } from "next";
import { isSecure } from "../edit/[character]/helpers-server";
import { PageContent } from "./PageContent";
import { DataSets, DataSource, IDataSource } from "data";
import { ViewBuilder } from "view/server";

export const metadata: Metadata = {
  title: "Création",
};

export default async function Page() {
  const returnTo = `/create`;

  if (await isSecure(returnTo)) {
    const dataSource: IDataSource = new DataSource();
    const builder = new ViewBuilder();

    const books = await dataSource.get(DataSets.Book).getAll();
    const races = builder.createRaceEntry(await dataSource.get(DataSets.Races).getAll());
    const themes = builder.createEntry(await dataSource.get(DataSets.Themes).getAll());
    const classes = builder.createEntry(await dataSource.get(DataSets.Class).getAll());

    return <PageContent books={books} races={races} themes={themes} classes={classes} />;
  }
}
