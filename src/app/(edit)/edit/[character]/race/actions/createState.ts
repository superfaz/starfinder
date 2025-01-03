"use server";

import { DataSource } from "data";
import { CharacterPresenter } from "logic/server";
import { Character } from "model";
import { OriginFeature } from "view";

export interface UpdateState {
  race?: string;
  variant?: string;
  selectableBonus?: string;
  primaryTraits: OriginFeature[];
  secondaryTraits: OriginFeature[];
  selectedTraits: string[];
}

export async function createState(character: Character): Promise<UpdateState> {
  const presenter = new CharacterPresenter(new DataSource(), character);

  const primaryTraits = await presenter.getPrimaryRaceTraits();
  const secondaryTraits = await presenter.getSecondaryRaceTraits();

  return {
    race: character.origin,
    variant: character.variant,
    selectableBonus: character.originOptions?.selectableBonus,
    primaryTraits: primaryTraits.success ? primaryTraits.value.primaryTraits : [],
    secondaryTraits: secondaryTraits.success ? secondaryTraits.value.secondaryTraits : [],
    selectedTraits: character.traits,
  };
}
