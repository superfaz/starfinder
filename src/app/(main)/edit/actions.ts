"use server";

import { revalidatePath } from "next/cache";
import { addData, onSuccess, passThrough, start, succeed } from "chain-of-actions";
import { characterService, getAuthenticatedUser, getDataSource } from "logic/server";

export async function deleteCharacter(characterId: string) {
  return await start()
    .add(onSuccess(() => succeed({ characterId })))
    .add(addData(getAuthenticatedUser))
    .add(addData(getDataSource))
    .add(passThrough(characterService.delete))
    .add(onSuccess(() => succeed(revalidatePath("/edit"))))
    .runAsync();
}
