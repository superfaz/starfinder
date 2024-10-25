"use server";

import { DataSource } from "data";
import { CharacterPresenter } from "logic/server";
import { Character } from "model";
import { RaceFeature } from "view";

export interface UpdateState {
  race?: string;
  variant?: string;
  selectableBonus?: string;
  primaryTraits: RaceFeature[];
  secondaryTraits: RaceFeature[];
  selectedTraits: string[];
}

export async function createState(character: Character): Promise<UpdateState> {
  const presenter = new CharacterPresenter(new DataSource(), character);

  const primaryTraits = await presenter.getPrimaryRaceTraits();
  const secondaryTraits = await presenter.getSecondaryRaceTraits();

  return {
    race: character.race,
    variant: character.raceVariant,
    selectableBonus: character.raceOptions?.selectableBonus,
    primaryTraits: primaryTraits.success ? primaryTraits.value : [],
    secondaryTraits: secondaryTraits.success ? secondaryTraits.value : [],
    selectedTraits: character.traits,
  };
}
