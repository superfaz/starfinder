import { AbilityScore, Alignment, Class, Race, Skill, Special, Theme } from "../../types";
import { ClientComponent } from "./client";
import Races from "./races.json";
import Themes from "./themes.json";
import Classes from "./classes.json";
import Skills from "./skills.json";
import AbilityScores from "./ability-scores.json";
import Specials from "./specials.json";
import Alignments from "./alignments.json";

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

async function getAbilityScores(): Promise<AbilityScore[]> {
  return AbilityScores;
}

async function getSpecials(): Promise<Record<string, Special>> {
  return Specials;
}

async function getAlignments(): Promise<Alignment[]> {
  return Alignments;
}

export default async function Page() {
  const races = await getRaces();
  const themes = await getThemes();
  const classes = await getClasses();
  const skills = await getSkills();
  const abilityScores = await getAbilityScores();
  const specials = await getSpecials();
  const alignments = await getAlignments();

  return (
    <>
      <h1>Création de personnage</h1>

      <ClientComponent
        races={races}
        themes={themes}
        classes={classes}
        skills={skills}
        abilityScores={abilityScores}
        specials={specials}
        alignments={alignments}
      />
    </>
  );
}
