"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import { DataSets, DataSource, IDataSource } from "data";
import { Character, IdSchema } from "model";
import { CharacterPresenter, updateCharacter } from "logic/server";
import { ActionResult } from "app/helpers-server";
import { RaceFeature } from "view";

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

  return {
    race: character.race,
    variant: character.raceVariant,
    selectableBonus: character.raceOptions?.selectableBonus,
    primaryTraits: await presenter.getPrimaryRaceTraits(),
    secondaryTraits: await presenter.getSecondaryRaceTraits(),
    selectedTraits: character.traits,
  };
}

const UpdateRaceInputSchema = z.object({
  characterId: IdSchema,
  raceId: IdSchema,
});

export type UpdateRaceInput = z.infer<typeof UpdateRaceInputSchema>;

export async function updateRace(data: UpdateRaceInput): Promise<ActionResult<UpdateRaceInput, UpdateState>> {
  // Security check
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  if (!isUserAuthenticated || !user) {
    throw new Error("Unauthorized");
  }

  // Data check
  const check = UpdateRaceInputSchema.safeParse(data);

  if (!check.success) {
    return { success: false, errors: check.error.flatten().fieldErrors };
  }

  const dataSource: IDataSource = new DataSource();
  const character = await dataSource.get(DataSets.Characters).getOne(data.characterId);
  if (!character) {
    return { success: false, errors: { characterId: ["Not found"] } };
  }
  if (character.userId !== user.id) {
    return { success: false, errors: { characterId: ["Unauthorized"] } };
  }

  // Update the character
  const builder = updateCharacter(dataSource, character);
  if (!(await builder.updateRace(data.raceId))) {
    return { success: false, errors: { raceId: ["Invalid"] } };
  }

  // Save the character
  const result = await dataSource.get(DataSets.Characters).update(builder.getCharacter());
  return { success: true, ...(await createState(result)) };
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
  // Security check
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  if (!isUserAuthenticated || !user) {
    throw new Error("Unauthorized");
  }

  // Data check
  const check = UpdateTraitInputSchema.safeParse(data);

  if (!check.success) {
    return { success: false, errors: check.error.flatten().fieldErrors };
  }

  const dataSource: IDataSource = new DataSource();
  const character = await dataSource.get(DataSets.Characters).getOne(data.characterId);
  if (!character) {
    return { success: false, errors: { characterId: ["Not found"] } };
  }
  if (character.userId !== user.id) {
    return { success: false, errors: { characterId: ["Unauthorized"] } };
  }

  const presenter = new CharacterPresenter(dataSource, character);
  const trait = (await presenter.getSecondaryRaceTraits()).find((t) => t.id === data.traitId);
  if (!trait) {
    return { success: false, errors: { traitId: ["Invalid"] } };
  }

  // Update the character
  const builder = updateCharacter(dataSource, character);
  if (data.enable) {
    if (!(await builder.enableSecondaryTrait(trait))) {
      return { success: false, errors: { traitId: ["Invalid"] } };
    }
  } else {
    if (!(await builder.disableSecondaryTrait(trait))) {
      return { success: false, errors: { traitId: ["Invalid"] } };
    }
  }

  // Save the character
  const result = await dataSource.get(DataSets.Characters).update(builder.getCharacter());
  return { success: true, ...(await createState(result)) };
}
