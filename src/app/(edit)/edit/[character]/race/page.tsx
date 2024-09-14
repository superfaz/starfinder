import { Metadata } from "next";
import { isSecure } from "app/helpers-server";
import { DataSets, DataSource } from "data";
import { PageContent } from "./PageContent";
import { createRaceEntry } from "view/server";
import { retrieveCharacter } from "../helpers-server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Sélection de la race",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const characterId = params.character;
  const returnTo = `/edit/${characterId}/race`;

  if (!(await isSecure(returnTo))) {
    return null;
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
  const races = createRaceEntry(await dataSource.get(DataSets.Races).getAll());

  const form = {
    race: result.character.race,
    variant: result.character.raceVariant,
    selectableBonus: result.character.raceOptions?.selectableBonus,
  };

  return <PageContent races={races} initial={form} />;
}
