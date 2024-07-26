import type { ArmorEquipmentDescriptor, ArmorTypeId, Modifier, SavingThrow } from "model";

export interface ICharacterPresenter {
  getModifiers(): Modifier[];
  getAbilityScores(): Record<string, number>;
  getSavingThrowBonus(savingThrow: SavingThrow): number | undefined;
  getEnergyArmorClass(): number;
  getKineticArmorClass(): number;
  getArmorClassAgainstCombatManeuvers(): number;
  getArmorProficiencies(): ArmorTypeId[] | undefined;
  getArmors(): ArmorEquipmentDescriptor[] | undefined;
}
