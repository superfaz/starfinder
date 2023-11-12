import { Race, Theme } from "../../types";
import { ClientComponent } from "./client";
import Races from "./races.json";
import Themes from "./themes.json";

async function getRaces(): Promise<Race[]> {
  return Races;
}

async function getThemes(): Promise<Theme[]> {
  return Themes;
}

export default async function Page() {
  const races = await getRaces();
  const themes = await getThemes();

  return (
    <>
      <h1>Création de personnage</h1>

      <ClientComponent races={races} themes={themes} />
    </>
  );
}
