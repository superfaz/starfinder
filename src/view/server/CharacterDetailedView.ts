import { DataSets } from "data";
import type { Character } from "model";
import { CharacterDetailedView, CharacterView } from "../interfaces";
import type { ViewBuilder } from "./ViewBuilder";

import "server-only";

export async function createCharacterDetailed(this: ViewBuilder, character: Character): Promise<CharacterDetailedView> {
  const avatar = await this.dataSource.get(DataSets.Avatars).findOne(character.avatar);
  const race = await this.dataSource.get(DataSets.Races).findOne(character.origin);
  const theme = await this.dataSource.get(DataSets.Themes).findOne(character.theme);
  const klass = await this.dataSource.get(DataSets.Classes).findOne(character.class);

  if (!avatar.success || !race.success || !theme.success || !klass.success) {
    throw new Error("Failed to load character details");
  }

  return {
    id: character.id,
    name: character.name,
    avatar: avatar.value?.image,
    race: race.value ? this.createEntry(race.value) : undefined,
    theme: theme.value ? this.createEntry(theme.value) : undefined,
    class: klass.value ? this.createEntry(klass.value) : undefined,
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
