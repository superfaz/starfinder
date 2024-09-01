import { DataSets, IDataSource } from "data";
import { Character } from "model";
import "server-only";

export interface CharacterVM {
  id: string;
  name: string;
  avatar?: string;
  race?: string;
  theme?: string;
  class?: string;
  level?: number;
}

export async function toViewModel(dataSource: IDataSource, characters: Character[]): Promise<CharacterVM[]>;
export async function toViewModel(dataSource: IDataSource, characters: Character): Promise<CharacterVM>;
export async function toViewModel(
  dataSource: IDataSource,
  characters: Character[] | Character
): Promise<CharacterVM[] | CharacterVM> {
  if (Array.isArray(characters)) {
    return await Promise.all(characters.map((c) => toViewModel(dataSource, c)));
  }

  const c = characters;
  return {
    id: c.id,
    name: c.name,
    avatar: (await dataSource.get(DataSets.Avatar).findOne(c.avatar))?.image,
    race: (await dataSource.get(DataSets.Races).findOne(c.race))?.name,
    theme: (await dataSource.get(DataSets.Themes).findOne(c.theme))?.name,
    class: (await dataSource.get(DataSets.Class).findOne(c.class))?.name,
    level: c.level,
  };
}
