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

  const c = characters;
  return {
    id: c.id,
    name: c.name,
    avatar: (await this.dataSource.get(DataSets.Avatar).findOne(c.avatar))?.image,
    race: (await this.dataSource.get(DataSets.Races).findOne(c.race))?.name,
    theme: (await this.dataSource.get(DataSets.Themes).findOne(c.theme))?.name,
    class: (await this.dataSource.get(DataSets.Class).findOne(c.class))?.name,
    level: c.level,
  };
}
