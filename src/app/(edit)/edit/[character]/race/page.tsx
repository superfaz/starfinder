import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSecure } from "app/helpers-server";
import { DataSets, DataSource } from "data";
import { retrieveCharacter } from "../helpers-server";
import { createState } from "./actions";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection de la race",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const characterId = params.character;
  const returnTo = `/edit/${characterId}/race`;

  if (!(await isSecure(returnTo))) {
    throw new Error("Unexpected error");
  }

  const result = await retrieveCharacter(characterId);
  if (!result.success) {
    if (result.errorCode === "notFound") {
      return notFound();
    } else {
      console.error("Unexpected error", result.message);
      throw new Error("Unexpected error");
    }
  }

  const dataSource = new DataSource();
  const races = await dataSource.get(DataSets.Races).getAll();
  const initial = await createState(result.character);

  return <PageContent races={races} initial={initial} />;
}
