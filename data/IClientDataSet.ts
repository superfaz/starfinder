import {
  AbilityScore,
  Alignment,
  Armor,
  Avatar,
  Class,
  FeatTemplate,
  Profession,
  Race,
  SavingThrow,
  SkillDefinition,
  Spell,
  Theme,
  Weapon,
} from "model";
import { IDataSet } from "./IDataSet";

export interface IClientDataSet {
  abilityScores: AbilityScore[];
  alignments: Alignment[];
  avatars: Avatar[];
  classes: Class[];
  feats: FeatTemplate[];
  races: Race[];
  savingThrows: SavingThrow[];
  skills: SkillDefinition[];
  spells: Spell[];
  themes: Theme[];
  armors: Armor[];
  weapons: Weapon[];
  professions: Profession[];
}

export const EmptyClientDataSet: IClientDataSet = {
  abilityScores: [],
  alignments: [],
  avatars: [],
  classes: [],
  feats: [],
  races: [],
  savingThrows: [],
  skills: [],
  spells: [],
  themes: [],
  armors: [],
  weapons: [],
  professions: [],
};

export async function convert(serverData: IDataSet): Promise<IClientDataSet> {
  return {
    abilityScores: await serverData.getAbilityScores(),
    alignments: await serverData.getAlignments(),
    armors: await serverData.getArmors(),
    avatars: await serverData.getAvatars(),
    classes: await serverData.getClasses(),
    feats: await serverData.getFeats(),
    races: await serverData.getRaces(),
    savingThrows: await serverData.getSavingThrows(),
    skills: await serverData.getSkills(),
    spells: await serverData.getSpells(),
    themes: await serverData.getThemes(),
    weapons: await serverData.getWeapons(),
    professions: await serverData.getProfessions(),
  };
}
