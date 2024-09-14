"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { DataSets, DataSource, IDataSource } from "data";

export async function deleteCharacter(id: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (user === null) {
    throw new Error("User not found");
  }

  const dataSource: IDataSource = new DataSource();
  dataSource.get(DataSets.Characters).delete({ id, userId: user.id });
  revalidatePath("/edit");
}
