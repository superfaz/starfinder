"use server";

import { fail, start, succeed } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets, DataSource } from "data";
import {
  CharacterPresenter,
  getAuthenticatedUser,
  getDataSource,
  hasValidInput,
  createBuilder,
  createCharacterPresenter,
} from "logic/server";
import { NotFoundError, ParsingError } from "logic";
import { Character, IdSchema } from "model";
import { RaceFeature } from "view";
import { prepareActionContext, retrieveCharacter } from "../helpers-server";

export interface UpdateState {
  race?: string;
  variant?: string;
  selectableBonus?: string;
  primaryTraits: RaceFeature[];
  secondaryTraits: RaceFeature[];
  selectedTraits: string[];
}

export async function createState(character: Character): Promise<UpdateState> {
  const presenter = new CharacterPresenter(new DataSource(), character);

  const primaryTraits = await presenter.getPrimaryRaceTraits();
  const secondaryTraits = await presenter.getSecondaryRaceTraits();

  return {
    race: character.race,
    variant: character.raceVariant,
    selectableBonus: character.raceOptions?.selectableBonus,
    primaryTraits: primaryTraits.success ? primaryTraits.value : [],
    secondaryTraits: secondaryTraits.success ? secondaryTraits.value : [],
    selectedTraits: character.traits,
  };
}

const UpdateRaceInputSchema = z.object({
  characterId: IdSchema,
  raceId: IdSchema,
});

export type UpdateRaceInput = z.infer<typeof UpdateRaceInputSchema>;

export async function updateRace(data: UpdateRaceInput): Promise<ActionResult<UpdateRaceInput, UpdateState>> {
  const context = await prepareActionContext(UpdateRaceInputSchema, data);

  if (!context.success) {
    if (context.error instanceof ParsingError) {
      return { success: false, errors: context.error.errors };
    } else if (context.error instanceof NotFoundError) {
      return { success: false, errors: { characterId: ["Not found"] } };
    } else {
      throw context.error;
    }
  }

  const action = await start(undefined, context.value)
    .onSuccess((_, { input, builder }) => builder.updateRace(input.raceId))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.getCharacter()))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { raceId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

const UpdateVariantInputSchema = z.object({
  characterId: IdSchema,
  variantId: IdSchema,
});

export type UpdateVariantInput = z.infer<typeof UpdateVariantInputSchema>;

export async function updateVariant(data: UpdateVariantInput): Promise<ActionResult<UpdateVariantInput, UpdateState>> {
  const context = await prepareActionContext(UpdateVariantInputSchema, data);

  if (!context.success) {
    if (context.error instanceof ParsingError) {
      return { success: false, errors: context.error.errors };
    } else if (context.error instanceof NotFoundError) {
      return { success: false, errors: { variantId: ["Not found"] } };
    } else {
      throw context.error;
    }
  }

  const action = await start(undefined, context.value)
    .onSuccess((_, { input, builder }) => builder.updateRaceVariant(input.variantId))
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.getCharacter()))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { variantId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}

const UpdateTraitInputSchema = z.object({
  characterId: IdSchema,
  traitId: IdSchema,
  enable: z.boolean(),
});

export type UpdateTraitInput = z.infer<typeof UpdateTraitInputSchema>;

export async function updateSecondaryTrait(
  data: UpdateTraitInput
): Promise<ActionResult<UpdateTraitInput, UpdateState>> {
  const context = await start()
    .onSuccess(getAuthenticatedUser)
    .addData(() => hasValidInput(UpdateTraitInputSchema, data))
    .addData(getDataSource)
    .addData(({ dataSource, user }) => retrieveCharacter(data.characterId, dataSource, user))
    .addData(({ dataSource, character }) => createBuilder(dataSource, character))
    .addData(createCharacterPresenter)
    .runAsync();

  if (!context.success) {
    if (context.error instanceof ParsingError) {
      return { success: false, errors: context.error.errors };
    } else if (context.error instanceof NotFoundError) {
      return { success: false, errors: { characterId: ["Not found"] } };
    } else {
      throw context.error;
    }
  }

  const action = await start(undefined, context.value)
    .onSuccess(async (_, { presenter }) => presenter.getSecondaryRaceTraits())
    .onSuccess((traits, { input }) => succeed(traits.find((t) => t.id === input.traitId)))
    .onSuccess((trait) => (trait !== undefined ? succeed(trait) : fail(new NotFoundError())))
    .onSuccess((trait, { builder, input }) =>
      input.enable ? builder.enableSecondaryTrait(trait) : builder.disableSecondaryTrait(trait)
    )
    .onSuccess((_, { dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.getCharacter()))
    .runAsync();

  if (!action.success) {
    if (action.error instanceof NotFoundError) {
      return { success: false, errors: { traitId: ["Not found"] } };
    } else {
      return { success: false, errors: { traitId: ["Invalid"] } };
    }
  }

  return { success: true, ...(await createState(action.value)) };
}
