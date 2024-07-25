import { findOrError } from "app/helpers";
import { IClientDataSet } from "data";
import { ClassMechanic, DroneChassis, Modifier, ModifierTypes, SavingThrow, Size, ofType } from "model";
import { CharacterPresenter, computeAbilityScoreModifier } from "./CharacterPresenter";
import { ICharacterPresenter } from "./ICharacterPresenter";

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

  public getModifiers(): Modifier[] {
    return this.getChassis()?.modifiers ?? [];
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

    const chassisBonus = computeSavingThrowBonus(1, chassis.savingThrows[savingThrow.id]);
    const abilityScoreBonus = computeAbilityScoreModifier(this.getAbilityScores()[savingThrow.abilityScore]);
    const otherBonus = this.getModifiers()
      .filter(ofType(ModifierTypes.savingThrowBonus))
      .filter((b) => b.target === savingThrow.id)
      .reduce((a, c) => a + c.value, 0);

    return chassisBonus + abilityScoreBonus + otherBonus;
  }
}
