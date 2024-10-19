import { DataSets } from "data";
import type { Character } from "model";
import { CharacterView } from "../interfaces";
import type { ViewBuilder } from "./ViewBuilder";

import "server-only";

export async function createCharacter(this: ViewBuilder, characters: Character[]): Promise<CharacterView[]>;
export async function createCharacter(this: ViewBuilder, characters: Character): Promise<CharacterView>;
export async function createCharacter(
  this: ViewBuilder,
  characters: Character[] | Character
): Promise<CharacterView[] | CharacterView> {
  if (Array.isArray(characters)) {
    return await Promise.all(characters.map((c) => createCharacter.bind(this)(c)));
  }

  const avatar = await this.dataSource.get(DataSets.Avatar).findOne(characters.avatar);
  const race = await this.dataSource.get(DataSets.Races).findOne(characters.race);
  const theme = await this.dataSource.get(DataSets.Themes).findOne(characters.theme);
  const klass = await this.dataSource.get(DataSets.Class).findOne(characters.class);

  if (!avatar.success) throw avatar.error;
  if (!race.success) throw race.error;
  if (!theme.success) throw theme.error;
  if (!klass.success) throw klass.error;

  const c = characters;
  return {
    id: c.id,
    name: c.name,
    avatar: avatar.value?.image,
    race: race.value?.name,
    theme: theme.value?.name,
    class: klass.value?.name,
    level: c.level,
  };
}
