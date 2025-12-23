import { avatarService, classService, originService, themeService } from "logic/server";
import type { Character } from "model";
import { CharacterView } from "../interfaces";
import type { ViewBuilder } from "./ViewBuilder";

import "server-only";

export async function createCharacter(this: ViewBuilder, character: Character): Promise<CharacterView> {
  const data = await Promise.all([
    avatarService.findOne({ dataSource: this.dataSource, avatarId: character.avatar }),
    originService.findOne({ dataSource: this.dataSource, originId: character.origin }),
    themeService.findOne({ dataSource: this.dataSource, themeId: character.theme }),
    classService.findOne({ dataSource: this.dataSource, classId: character.class }),
  ]);

  if (!data[0].success) throw data[0].error;
  if (!data[1].success) throw data[1].error;
  if (!data[2].success) throw data[2].error;
  if (!data[3].success) throw data[3].error;

  return {
    id: character.id,
    name: character.name,
    avatar: data[0].value?.image,
    race: data[1].value?.name,
    theme: data[2].value?.name,
    class: data[3].value?.name,
    level: character.level,
  };
}
