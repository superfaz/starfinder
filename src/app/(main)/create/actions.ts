"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import { DataSets, DataSource, IDataSource } from "data";
import { createCharacter } from "logic/server";
import { IdSchema } from "model";
import { type ActionResult } from "app/helpers-server";

const CreateDataSchema = z.object({
  race: z.preprocess((v) => v || undefined, IdSchema.optional()),
  theme: z.preprocess((v) => v || undefined, IdSchema.optional()),
  class: z.preprocess((v) => v || undefined, IdSchema.optional()),
  name: z.preprocess((v) => v || undefined, z.string()),
  description: z.preprocess((v) => v || undefined, z.string().optional()),
});

export type CreateData = z.infer<typeof CreateDataSchema>;

export type CreateResult = ActionResult<CreateData, { id: string }>;

export async function create(data: CreateData): Promise<CreateResult> {
  // Security check
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  if (!isUserAuthenticated || !user) {
    throw new Error("Unauthorized");
  }

  // Data check
  const check = CreateDataSchema.safeParse(data);

  if (!check.success) {
    return { success: false, errors: check.error.flatten().fieldErrors };
  }

  const dataSource: IDataSource = new DataSource();
  const builder = createCharacter(dataSource, user.id);
  let errors = {};
  if (check.data.race && !(await builder.updateRace(check.data.race))) {
    errors = { ...errors, race: ["Invalid"] };
  }
  if (check.data.theme && !(await builder.updateTheme(check.data.theme))) {
    errors = { ...errors, theme: ["Invalid"] };
  }
  if (check.data.class && !(await builder.updateClass(check.data.class))) {
    errors = { ...errors, class: ["Invalid"] };
  }
  if (check.data.name && !(await builder.updateName(check.data.name))) {
    errors = { ...errors, name: ["Invalid"] };
  }
  if (check.data.description && !(await builder.updateDescription(check.data.description))) {
    errors = { ...errors, description: ["Invalid"] };
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // Save character data
  const character = builder.getCharacter();
  await dataSource.get(DataSets.Characters).create(character);

  return { success: true, id: character.id };
}
