"use server";

import { fail, PromisedResult, Result, start, succeed } from "chain-of-actions";
import { z } from "zod";
import { type ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { DataSourceError, NotFoundError, ParsingError } from "logic";
import { CharacterBuilder, createBuilder, getAuthenticatedUser, getDataSource, hasValidInput } from "logic/server";
import { IdSchema } from "model";

const CreateDataSchema = z.object({
  race: z.preprocess((v) => v || undefined, IdSchema.optional()),
  theme: z.preprocess((v) => v || undefined, IdSchema.optional()),
  class: z.preprocess((v) => v || undefined, IdSchema.optional()),
  name: z.preprocess((v) => v || undefined, z.string()),
  description: z.preprocess((v) => v || undefined, z.string().optional()),
});

export type CreateData = z.infer<typeof CreateDataSchema>;

export type CreateResult = ActionResult<CreateData, { id: string }>;

function parsingError<Data, Err extends Error>(
  errors: Record<string, string[]>,
  previous: Result<Data, Err>
): ParsingError {
  if (!previous.success && previous.error instanceof ParsingError) {
    return new ParsingError({ ...previous.error.errors, ...errors });
  } else {
    return new ParsingError(errors);
  }
}

function tryUpdate<Err extends Error>(
  field: keyof CreateData,
  updator: (builder: CharacterBuilder, value: string) => PromisedResult<undefined, DataSourceError | NotFoundError>
) {
  return async (
    previous: Result<undefined, Err>,
    { builder, input }: { builder: CharacterBuilder; input: CreateData }
  ) => {
    if (input[field]) {
      const result = await updator(builder, input[field]);
      if (!result.success) {
        return fail(parsingError({ [field]: ["Invalid"] }, previous));
      }
    }

    return previous;
  };
}

export async function create(data: CreateData): Promise<ActionResult<CreateData, { id: string }>> {
  const context = await start()
    .onSuccess(() => hasValidInput(CreateDataSchema, data))
    .addData(() => getAuthenticatedUser())
    .addData(() => getDataSource())
    .addData(({ user, dataSource }) => createBuilder(dataSource, user.id))
    .runAsync();

  if (!context.success) {
    if (context.error instanceof ParsingError) {
      return { success: false, errors: context.error.errors };
    } else {
      throw context.error;
    }
  }

  const action = await start(context.value)
    .add(tryUpdate("race", (b, v) => b.updateRace(v)))
    .add(tryUpdate("theme", (b, v) => b.updateTheme(v)))
    .add(tryUpdate("class", (b, v) => b.updateClass(v)))
    .add(tryUpdate("name", (b, v) => b.updateName(v)))
    .add(tryUpdate("description", (b, v) => b.updateDescription(v)))
    .onSuccess(async (_, { builder, dataSource }) => {
      return dataSource.get(DataSets.Characters).create(builder.character);
    })
    .onSuccess(async (character) => {
      return succeed({ id: character.id });
    })
    .runAsync();

  if (!action.success) {
    if (action.error instanceof ParsingError) {
      return { success: false, errors: action.error.errors };
    } else {
      throw action.error;
    }
  }

  return { success: true, ...action.value };
}
