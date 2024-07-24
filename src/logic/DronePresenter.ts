import { ClassMechanic, DroneChassis } from "model";
import { CharacterPresenter } from "./CharacterPresenter";
import { ICharacterPresenter } from "./ICharacterPresenter";

export class DronePresenter implements ICharacterPresenter {
  constructor(
    private parent: CharacterPresenter,
    private data: ClassMechanic
  ) {}

  private getClassOptions(): Record<string, string> {
    return this.parent.getCharacter()?.classOptions ?? {};
  }

  public getChassis(): DroneChassis | undefined {
    return this.data.drone.chassis.find((c) => c.id === this.getClassOptions().droneChassis);
  }

  public getAbilityScores(): Record<string, number> {
    return this.getChassis()?.abilityScores ?? {};
  }
}
