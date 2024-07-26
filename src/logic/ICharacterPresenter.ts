import type { ArmorEquipmentDescriptor, ArmorTypeId, Modifier, SavingThrow } from "model";
import { SkillPresenter } from "./SkillPresenter";
import { ModifierWithSource } from "view";

export interface ICharacterPresenter {
  getLevel(): number;
  getModifiers(): Modifier[];
  getModifiersWithSource(): ModifierWithSource[];
  getAbilityScores(): Record<string, number>;
  getSavingThrowBonus(savingThrow: SavingThrow): number | undefined;
  getEnergyArmorClass(): number;
  getKineticArmorClass(): number;
  getArmorClassAgainstCombatManeuvers(): number;
  getArmorProficiencies(): ArmorTypeId[] | undefined;
  getArmors(): ArmorEquipmentDescriptor[] | undefined;
  getClassSkills(): string[];
  getSkills(): SkillPresenter[];
  getSkillRanks(id: string): number;
  getAttackBonuses(): { base: number; melee: number; ranged: number; thrown: number } | undefined;
}
