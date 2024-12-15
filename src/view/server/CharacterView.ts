import { DataSets } from "data";
import type { Character } from "model";
import { CharacterView } from "../interfaces";
import type { ViewBuilder } from "./ViewBuilder";

import "server-only";

export async function createCharacter(this: ViewBuilder, character: Character): Promise<CharacterView> {
  const avatar = await this.dataSource.get(DataSets.Avatars).findOne(character.avatar);
  const race = await this.dataSource.get(DataSets.Races).findOne(character.race);
  const theme = await this.dataSource.get(DataSets.Themes).findOne(character.theme);
  const klass = await this.dataSource.get(DataSets.Classes).findOne(character.class);

  if (!avatar.success) throw avatar.error;
  if (!race.success) throw race.error;
  if (!theme.success) throw theme.error;
  if (!klass.success) throw klass.error;

  return {
    id: character.id,
    name: character.name,
    avatar: avatar.value?.image,
    race: race.value?.name,
    theme: theme.value?.name,
    class: klass.value?.name,
    level: character.level,
  };
}
