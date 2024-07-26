import { findOrError } from "app/helpers";
import { IClientDataSet } from "data";
import {
  AbilityScoreIds,
  ClassMechanic,
  DroneChassis,
  Modifier,
  ModifierTypes,
  SavingThrow,
  Size,
  ofType,
} from "model";
import { CharacterPresenter, computeAbilityScoreModifier } from "./CharacterPresenter";
import { ICharacterPresenter } from "./ICharacterPresenter";
import { SkillPresenter, SkillPresenterBuilder } from "./SkillPresenter";
import { ModifierWithSource } from "view";

function computeSavingThrowBonus(level: number, type: "good" | "poor"): number {
  if (type === "good") {
    return Math.round((7 / 19) * level + 2);
  } else {
    return Math.floor(0.25 * level + 0.25);
  }
}

export class DronePresenter implements ICharacterPresenter {
  constructor(
    private parent: CharacterPresenter,
    private data: IClientDataSet,
    private classDetail: ClassMechanic
  ) {}

  private getClassOptions(): Record<string, string> {
    return this.parent.getCharacter()?.classOptions ?? {};
  }

  // private createTemplater(context: object = {}): Templater {
  //   return new Templater({ ...context });
  // }

  public getLevel(): number {
    return 1;
  }

  public getModifiers(): Modifier[] {
    return this.getChassis()?.modifiers ?? [];
  }

  public getModifiersWithSource(): ModifierWithSource[] {
    const chassis = this.getChassis();
    if (!chassis || !chassis.modifiers) {
      return [];
    }

    return chassis.modifiers.map((m) => ({ ...m, source: chassis }));
  }

  public getChassis(): DroneChassis | undefined {
    return this.classDetail.drone.chassis.find((c) => c.id === this.getClassOptions().droneChassis);
  }

  public getAllChassis(): DroneChassis[] {
    return this.classDetail.drone.chassis;
  }

  public getAbilityScores(): Record<string, number> {
    return this.getChassis()?.abilityScores ?? {};
  }

  public getName(): string {
    return this.getClassOptions().droneName;
  }

  public getSize(): Size | undefined {
    const chassis = this.getChassis();
    if (!chassis) {
      return undefined;
    }

    const sizeId = this.getModifiers().filter(ofType(ModifierTypes.size))[0]?.target || "medium";

    return findOrError(this.data.sizes, sizeId);
  }

  public getSpeed(): number {
    return (this.getModifiers().filter(ofType(ModifierTypes.speed))[0]?.value as number) ?? 6;
  }

  public getSavingThrowBonus(savingThrow: SavingThrow): number | undefined {
    const chassis = this.getChassis();
    if (!chassis) {
      return undefined;
    }

    const chassisBonus = computeSavingThrowBonus(this.getLevel(), chassis.savingThrows[savingThrow.id]);
    const abilityScoreBonus = computeAbilityScoreModifier(this.getAbilityScores()[savingThrow.abilityScore]);
    const otherBonus = this.getModifiers()
      .filter(ofType(ModifierTypes.savingThrowBonus))
      .filter((b) => b.target === savingThrow.id)
      .reduce((a, c) => a + c.value, 0);

    return chassisBonus + abilityScoreBonus + otherBonus;
  }

  public getArmorProficiencies(): undefined {
    return undefined;
  }

  public getArmors(): undefined {
    return undefined;
  }

  public getKineticArmorClass(): number {
    const chassis = this.getChassis();
    if (!chassis) {
      return 10;
    }

    const dexBonus = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.dex]);
    const base = chassis.armorClasses.kinetic;
    const modifierBonus = this.getModifiers()
      .filter(ofType(ModifierTypes.armorClass))
      .reduce((a, c) => a + c.value, 0);

    return base + dexBonus + modifierBonus;
  }

  public getEnergyArmorClass(): number {
    const chassis = this.getChassis();
    if (!chassis) {
      return 10;
    }

    const dexBonus = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.dex]);
    const base = chassis.armorClasses.energy;
    const modifierBonus = this.getModifiers()
      .filter(ofType(ModifierTypes.armorClass))
      .reduce((a, c) => a + c.value, 0);

    return base + dexBonus + modifierBonus;
  }

  public getArmorClassAgainstCombatManeuvers(): number {
    return 8 + this.getKineticArmorClass();
  }

  public getClassSkills(): string[] {
    const modifiers = this.getModifiers();
    return modifiers.filter(ofType(ModifierTypes.classSkill)).map((m) => m.target);
  }

  public getSkills(): SkillPresenter[] {
    const builder = new SkillPresenterBuilder(this, this.data);
    return builder.buildSkills(this.data.skills.filter((s) => s.abilityScore !== undefined));
  }

  public getSkillRanks(): number {
    return 0;
  }
}
