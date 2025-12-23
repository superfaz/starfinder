import { createContext, useContext } from "react";
import type {
  AbilityScore,
  ArmorType,
  Avatar,
  BodyPart,
  BonusCategory,
  Book,
  DamageType,
  Size,
  SkillDefinition,
  WeaponType,
} from "model";

export interface IStaticData {
  abilityScores: AbilityScore[];
  armorTypes: ArmorType[];
  avatars: Avatar[];
  bodyParts: BodyPart[];
  bonusCategories: BonusCategory[];
  books: Book[];
  damageTypes: DamageType[];
  sizes: Size[];
  skills: SkillDefinition[];
  weaponTypes: WeaponType[];
}

const EmptyContext: IStaticData = {
  abilityScores: [],
  armorTypes: [],
  avatars: [],
  bodyParts: [],
  bonusCategories: [],
  books: [],
  damageTypes: [],
  sizes: [],
  skills: [],
  weaponTypes: [],
};

export const StaticContext = createContext<IStaticData>(EmptyContext);

export function useStaticData(): IStaticData {
  return useContext(StaticContext);
}
