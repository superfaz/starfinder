import { DataSets } from "data";
import type { Character } from "model";
import type { ViewBuilder } from "./ViewBuilder";

import "server-only";

export interface CharacterDetailedView {
  id: string;
  name: string;
  avatar?: string;
  race?: string;
  theme?: string;
  class?: string;
  level?: number;
}

export async function createCharacterDetailed(this: ViewBuilder, character: Character): Promise<CharacterDetailedView> {
  return {
    id: character.id,
    name: character.name,
    avatar: (await this.dataSource.get(DataSets.Avatar).findOne(character.avatar))?.image,
    race: (await this.dataSource.get(DataSets.Races).findOne(character.race))?.name,
    theme: (await this.dataSource.get(DataSets.Themes).findOne(character.theme))?.name,
    class: (await this.dataSource.get(DataSets.Class).findOne(character.class))?.name,
    level: character.level,
  };
}
