import { AbilityScore, Alignment, Class, Race, Skill, Special, Theme } from "../../types";
import { ClientComponent } from "./client";
import Races from "@/data/races.json";
import Themes from "@/data/themes.json";
import Classes from "@/data/classes.json";
import Skills from "@/data/skills.json";
import AbilityScores from "@/data/ability-scores.json";
import Specials from "@/data/specials.json";
import Alignments from "@/data/alignments.json";

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
  const data = {
    races: await getRaces(),
    themes: await getThemes(),
    classes: await getClasses(),
    skills: await getSkills(),
    abilityScores: await getAbilityScores(),
    specials: await getSpecials(),
    alignments: await getAlignments(),
    armors: { light: "Lègére", heavy: "Lourde" },
    weapons: {
      basic: "Armes de corps à corps simples",
      advanced: "Armes de corps à corps évoluées",
      small: "Armes légères",
      long: "Armes longues",
      heavy: "Armes lourdes",
      sniper: "Armes de précision",
      grenade: "Grenades",
    },
  };

  return (
    <>
      <h1>Création de personnage</h1>
      <ClientComponent data={data} />
    </>
  );
}
