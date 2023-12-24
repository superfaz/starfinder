import { AbilityScore, Alignment, Avatar, Class, Race, SkillDefinition, Special, Theme } from "model";
import { AbilityScores, Alignments, Avatars, Classes, Races, Skills, Specials, Themes } from ".";

export interface DataSet {
  abilityScores: AbilityScore[];
  alignments: Alignment[];
  avatars: Avatar[];
  classes: Class[];
  races: Race[];
  skills: SkillDefinition[];
  specials: Record<string, Special>;
  themes: Theme[];
  armors: Record<string, string>;
  weapons: Record<string, string>;
}

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

function getAvatars(): Avatar[] {
  return Avatars;
}

export function buildDataSet(): DataSet {
  const data: DataSet = {
    abilityScores: getAbilityScores(),
    alignments: getAlignments(),
    avatars: getAvatars(),
    classes: getClasses(),
    races: getRaces(),
    themes: getThemes(),
    skills: getSkills(),
    specials: getSpecials(),
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

  return data;
}
