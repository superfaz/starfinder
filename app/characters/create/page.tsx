import { Class, Race, Theme } from "../../types";
import { ClientComponent } from "./client";
import Races from "./races.json";
import Themes from "./themes.json";
import Classes from "./classes.json";

async function getRaces(): Promise<Race[]> {
  return Races;
}

async function getThemes(): Promise<Theme[]> {
  return Themes;
}

async function getClasses(): Promise<Class[]> {
  return Classes;
}

export default async function Page() {
  const races = await getRaces();
  const themes = await getThemes();
  const classes = await getClasses();

  return (
    <>
      <h1>Création de personnage</h1>

      <ClientComponent races={races} themes={themes} classes={classes} />
    </>
  );
}
