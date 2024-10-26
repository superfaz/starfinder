import { PromisedResult, succeed } from "chain-of-actions";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { IDataSource } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Character, EmptyCharacter, IdSchema } from "model";
import { computeMinimalAbilityScores } from "./computeMinimalAbilityScores";
import { updateRace, updateRaceSelectableBonus, updateRaceVariant } from "./updateRace";
import { updateClass } from "./updateClass";
import {
  updateIconProfession,
  updateScholarSkill,
  updateScholarSpecialization,
  updateTheme,
  updateThemelessAbilityScore,
} from "./updateTheme";
import { disableSecondaryTrait, enableSecondaryTrait } from "./updateSecondaryTrait";

import "server-only";

export class CharacterBuilder {
  public readonly dataSource: IDataSource;

  public character: Readonly<Character>;

  constructor(dataSource: IDataSource, character: Character) {
    this.dataSource = dataSource;
    this.character = character;
  }

  update(field: string, value: unknown): PromisedResult<undefined, DataSourceError | NotFoundError> {
    switch (field) {
      case "race":
        return this.updateRace(IdSchema.parse(value));
      case "theme":
        return this.updateTheme(IdSchema.parse(value));
      case "class":
        return this.updateClass(IdSchema.parse(value));
      case "name":
        return this.updateName(z.string().parse(value));
      case "description":
        return this.updateDescription(z.string().parse(value));
      default:
        throw new Error(`Unknown field ${field}`);
    }
  }

  /**
   * Updates the name of a character.
   *
   * @param name - the new name
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async updateName(name: string): PromisedResult<undefined> {
    this.character = { ...this.character, name };
    return succeed(undefined);
  }

  /**
   * Updates the description of a character.
   *
   * @param description - the new description
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async updateDescription(description: string): PromisedResult<undefined> {
    this.character = { ...this.character, description };
    return succeed(undefined);
  }

  computeMinimalAbilityScores = computeMinimalAbilityScores.bind(this);

  enableSecondaryTrait = enableSecondaryTrait.bind(this);
  disableSecondaryTrait = disableSecondaryTrait.bind(this);

  updateClass = updateClass.bind(this);

  updateRace = updateRace.bind(this);
  updateRaceVariant = updateRaceVariant.bind(this);
  updateRaceSelectableBonus = updateRaceSelectableBonus.bind(this);

  updateTheme = updateTheme.bind(this);
  updateIconProfession = updateIconProfession.bind(this);
  updateScholarSkill = updateScholarSkill.bind(this);
  updateScholarSpecialization = updateScholarSpecialization.bind(this);
  updateThemelessAbilityScore = updateThemelessAbilityScore.bind(this);
}

export async function createBuilder(
  dataSource: IDataSource,
  userId: string
): PromisedResult<{ builder: CharacterBuilder }>;
export async function createBuilder(
  dataSource: IDataSource,
  character: Character
): PromisedResult<{ builder: CharacterBuilder }>;
export async function createBuilder(
  dataSource: IDataSource,
  characterOrUserId: Character | string
): PromisedResult<{ builder: CharacterBuilder }> {
  if (typeof characterOrUserId === "string") {
    return succeed({
      builder: new CharacterBuilder(dataSource, {
        ...EmptyCharacter,
        id: uuidv4(),
        userId: characterOrUserId,
        updatedAt: new Date().toISOString(),
      }),
    });
  } else {
    return succeed({
      builder: new CharacterBuilder(dataSource, {
        ...characterOrUserId,
        updatedAt: new Date().toISOString(),
      }),
    });
  }
}
