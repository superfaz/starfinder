import { AbilityScore, ArmorType, Avatar, Book, DamageType, Size, WeaponType } from "model";
import { createContext, useContext } from "react";

export interface IStaticData {
  abilityScores: AbilityScore[];
  armorTypes: ArmorType[];
  avatars: Avatar[];
  books: Book[];
  damageTypes: DamageType[];
  sizes: Size[];
  weaponTypes: WeaponType[];
}

const EmptyContext: IStaticData = {
  abilityScores: [],
  armorTypes: [],
  avatars: [],
  books: [],
  damageTypes: [],
  sizes: [],
  weaponTypes: [],
};

export const StaticContext = createContext<IStaticData>(EmptyContext);

export function useStaticData(): IStaticData {
  return useContext(StaticContext);
}
