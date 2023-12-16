import { AbilityScore, Alignment, Class, Race, SkillDefinition, Special, Theme } from "model";
import { ClientComponent } from "./client";
import { AbilityScores, Alignments, Classes, Races, Skills, Specials, Themes } from "data";
import { DataSet } from "data";

function getRaces(): Race[] {
  return Races;
}

function getThemes(): Theme[] {
  return Themes;
}

function getClasses(): Class[] {
  return Classes;
}

function getSkills(): SkillDefinition[] {
  return Skills;
}

function getAbilityScores(): AbilityScore[] {
  return AbilityScores;
}

function getSpecials(): Record<string, Special> {
  return Specials;
}

function getAlignments(): Alignment[] {
  return Alignments;
}

export default function Page() {
  const data: DataSet = {
    races: getRaces(),
    themes: getThemes(),
    classes: getClasses(),
    skills: getSkills(),
    abilityScores: getAbilityScores(),
    specials: getSpecials(),
    alignments: getAlignments(),
    armors: { light: "Légère", heavy: "Lourde" },
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
