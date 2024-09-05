import { DataSets } from "data";
import type { Character } from "model";
import { CharacterDetailedView, CharacterView } from "../interfaces";
import type { ViewBuilder } from "./ViewBuilder";

import "server-only";

export async function createCharacterDetailed(this: ViewBuilder, character: Character): Promise<CharacterDetailedView> {
  const race = await this.dataSource.get(DataSets.Races).findOne(character.race);
  const theme = await this.dataSource.get(DataSets.Themes).findOne(character.theme);
  const klass = await this.dataSource.get(DataSets.Class).findOne(character.class);
  return {
    id: character.id,
    name: character.name,
    avatar: (await this.dataSource.get(DataSets.Avatar).findOne(character.avatar))?.image,
    race: race ? this.createEntry(race) : undefined,
    theme: theme ? this.createEntry(theme) : undefined,
    class: klass ? this.createEntry(klass) : undefined,
    level: character.level,
  };
}

export function convert(character: CharacterDetailedView): CharacterView {
  return {
    id: character.id,
    name: character.name,
    avatar: character.avatar,
    race: character.race?.name,
    theme: character.theme?.name,
    class: character.class?.name,
    level: character.level,
  };
}
