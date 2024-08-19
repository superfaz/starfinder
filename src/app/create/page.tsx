import { Metadata } from "next";
import { isSecure } from "../edit/[character]/helpers-server";
import { PageContent } from "./PageContent";
import { DataSets, DataSource, IDataSource } from "data";

export const metadata: Metadata = {
  title: "Création",
};

export default async function Page() {
  const returnTo = `/create`;

  if (await isSecure(returnTo)) {
    const dataSource: IDataSource = new DataSource();
    const races = await dataSource.get(DataSets.Races).getAll();
    const themes = await dataSource.get(DataSets.Themes).getAll();
    const classes = await dataSource.get(DataSets.Class).getAll();

    return <PageContent races={races} themes={themes} classes={classes} />;
  }
}
