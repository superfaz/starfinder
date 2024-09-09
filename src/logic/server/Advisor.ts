import { IAdvisorResult, RaceAdvisorError } from "logic/interfaces";
import { Character } from "model";

export class RaceAdvisor {
  constructor() {}

  check(character: Character): RaceAdvisorError | undefined {
    if (character.race === undefined || character.race === "") {
      return RaceAdvisorError.RaceNotSelected;
    }

    return undefined;
  }
}

export function check(character: Character): IAdvisorResult {
  return {
    race: new RaceAdvisor().check(character),
  };
}
