import { ArmorType, Book, DamageType, Size, WeaponType } from "model";
import { createContext, useContext } from "react";

export interface IStaticData {
  armorTypes: ArmorType[];
  books: Book[];
  damageTypes: DamageType[];
  sizes: Size[];
  weaponTypes: WeaponType[];
}

const EmptyContext: IStaticData = {
  armorTypes: [],
  books: [],
  damageTypes: [],
  sizes: [],
  weaponTypes: [],
};

export const StaticContext = createContext<IStaticData>(EmptyContext);

export function useStaticData(): IStaticData {
  return useContext(StaticContext);
}
