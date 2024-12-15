"use server";

import { start } from "chain-of-actions";
import { z } from "zod";
import { ActionResult } from "app/helpers-server";
import { DataSets } from "data";
import { NotFoundError, ParsingError } from "logic";
import { IdSchema } from "model";
import { prepareActionContext } from "../../helpers-server";
import { createState, UpdateState } from "./createState";

const UpdateThemeInputSchema = z.object({
  characterId: IdSchema,
  themeId: IdSchema,
});

export type UpdateThemeInput = z.infer<typeof UpdateThemeInputSchema>;

export async function updateTheme(data: UpdateThemeInput): Promise<ActionResult<UpdateThemeInput, UpdateState>> {
  const context = await prepareActionContext(UpdateThemeInputSchema, data);

  if (!context.success) {
    if (context.error instanceof ParsingError) {
      return { success: false, errors: context.error.errors };
    } else if (context.error instanceof NotFoundError) {
      return { success: false, errors: { characterId: ["Not found"] } };
    } else {
      throw context.error;
    }
  }

  const action = await start(context.value)
    .onSuccess(({ input, builder }) => builder.updateTheme(input.themeId))
    .onSuccess(({ dataSource, builder }) => dataSource.get(DataSets.Characters).update(builder.character))
    .runAsync();

  if (!action.success) {
    return { success: false, errors: { themeId: ["Invalid"] } };
  }

  return { success: true, ...(await createState(action.value)) };
}
