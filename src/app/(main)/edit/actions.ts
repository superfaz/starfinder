"use server";

import { revalidatePath } from "next/cache";
import { addData, onSuccess, passThrough, start, succeed } from "chain-of-actions";
import { characters, getAuthenticatedUser, getDataSource } from "logic/server";

export async function deleteCharacter(id: string) {
  return await start()
    .add(onSuccess(() => succeed({ id })))
    .add(addData(getAuthenticatedUser))
    .add(addData(getDataSource))
    .add(passThrough(characters.delete))
    .add(onSuccess(() => succeed(revalidatePath("/edit"))))
    .runAsync();
}
