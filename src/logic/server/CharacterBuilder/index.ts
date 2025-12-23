import { PromisedResult, succeed } from "chain-of-actions";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { IDataSource } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Character, EmptyCharacter, IdSchema } from "model";
import { computeMinimalAbilityScores } from "./computeMinimalAbilityScores";
import { updateOrigin, updateOriginSelectableBonus, updateOriginVariant } from "./updateOrigin";
import {
  updateClass,
  updateEnvoySkill,
  updateMechanicStyle,
  updateMysticConnection,
  updateOperativeSpecialization,
  updateSolarianColor,
  updateSolarianDamageType,
  updateSolarianManifestation,
  updateSoldierAbilityScore,
  updateSoldierPrimaryStyle,
} from "./updateClass";
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

  async update(field: string, value: unknown): PromisedResult<undefined, DataSourceError | NotFoundError> {
    switch (field) {
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
    return succeed();
  }

  /**
   * Updates the description of a character.
   *
   * @param description - the new description
   * @returns A promise that resolved to `undefined` in case of success, or an error otherwise.
   */
  async updateDescription(description: string): PromisedResult<undefined> {
    this.character = { ...this.character, description };
    return succeed();
  }

  computeMinimalAbilityScores = computeMinimalAbilityScores.bind(this);

  static updateOrigin = updateOrigin;
  static updateOriginVariant = updateOriginVariant;
  static updateOriginSelectableBonus = updateOriginSelectableBonus;
  static enableSecondaryTrait = enableSecondaryTrait;
  static disableSecondaryTrait = disableSecondaryTrait;

  updateTheme = updateTheme.bind(this);
  updateIconProfession = updateIconProfession.bind(this);
  updateScholarSkill = updateScholarSkill.bind(this);
  updateScholarSpecialization = updateScholarSpecialization.bind(this);
  updateThemelessAbilityScore = updateThemelessAbilityScore.bind(this);

  updateClass = updateClass.bind(this);
  updateEnvoySkill = updateEnvoySkill.bind(this);
  updateMechanicStyle = updateMechanicStyle.bind(this);
  updateMysticConnection = updateMysticConnection.bind(this);
  updateOperativeSpecialization = updateOperativeSpecialization.bind(this);
  updateSolarianColor = updateSolarianColor.bind(this);
  updateSolarianManifestation = updateSolarianManifestation.bind(this);
  updateSolarianDamageType = updateSolarianDamageType.bind(this);
  updateSoldierAbilityScore = updateSoldierAbilityScore.bind(this);
  updateSoldierPrimaryStyle = updateSoldierPrimaryStyle.bind(this);
}

export async function createEmptyBuilder({
  dataSource,
  user,
}: {
  dataSource: IDataSource;
  user: { id: string };
}): PromisedResult<{ builder: CharacterBuilder }> {
  return succeed({
    builder: new CharacterBuilder(dataSource, {
      ...EmptyCharacter,
      id: uuidv4(),
      userId: user.id,
      updatedAt: new Date().toISOString(),
    }),
  });
}

export async function createInitializedBuilder({
  dataSource,
  character,
}: {
  dataSource: IDataSource;
  character: Character;
}): PromisedResult<{ builder: CharacterBuilder }> {
  return succeed({
    builder: new CharacterBuilder(dataSource, {
      ...character,
      updatedAt: new Date().toISOString(),
    }),
  });
}
