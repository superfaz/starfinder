import { Metadata } from "next";
import { isSecure } from "../edit/[character]/helpers-server";
import { PageContent } from "./PageContent";
import { DataSets, DataSource, IDataSource } from "data";
import { forSelect, forSelectRace } from "view/Select";

export const metadata: Metadata = {
  title: "Création",
};

export default async function Page() {
  const returnTo = `/create`;

  if (await isSecure(returnTo)) {
    const dataSource: IDataSource = new DataSource();
    const books = await dataSource.get(DataSets.Book).getAll();
    const races = forSelectRace(await dataSource.get(DataSets.Races).getAll());
    const themes = forSelect(await dataSource.get(DataSets.Themes).getAll());
    const classes = forSelect(await dataSource.get(DataSets.Class).getAll());

    return <PageContent books={books} races={races} themes={themes} classes={classes} />;
  }
}
