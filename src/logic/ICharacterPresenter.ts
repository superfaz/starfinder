import { Modifier, SavingThrow } from "model";

export interface ICharacterPresenter {
  getModifiers(): Modifier[];
  getAbilityScores(): Record<string, number>;
  getSavingThrowBonus(savingThrow: SavingThrow): number | undefined;
}
