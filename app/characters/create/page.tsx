import { Class, Race, Skill, Theme } from "../../types";
import { ClientComponent } from "./client";
import Races from "./races.json";
import Themes from "./themes.json";
import Classes from "./classes.json";
import Skills from "./skills.json";

async function getRaces(): Promise<Race[]> {
  return Races;
}

async function getThemes(): Promise<Theme[]> {
  return Themes;
}

async function getClasses(): Promise<Class[]> {
  return Classes;
}

async function getSkills(): Promise<Skill[]> {
  return Skills;
}

export default async function Page() {
  const races = await getRaces();
  const themes = await getThemes();
  const classes = await getClasses();
  const skills = await getSkills();

  return (
    <>
      <h1>Création de personnage</h1>

      <ClientComponent races={races} themes={themes} classes={classes} skills={skills} />
    </>
  );
}
