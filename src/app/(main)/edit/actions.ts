"use server";

import { revalidatePath } from "next/cache";
import { DataSets } from "data";
import { start, succeed } from "chain-of-actions";
import { getAuthenticatedUser, getDataSource } from "logic/server";

export async function deleteCharacter(id: string) {
  return await start({ id })
    .addData(getAuthenticatedUser)
    .addData(getDataSource)
    .onSuccess(({ id, user, dataSource }) => dataSource.get(DataSets.Characters).delete({ id, userId: user.id }))
    .onSuccess(() => succeed(revalidatePath("/edit")))
    .runAsync();
}
