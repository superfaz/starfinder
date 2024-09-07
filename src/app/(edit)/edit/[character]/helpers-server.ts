import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { DataSets, DataSource, type IDataSource } from "data";
import { type Character, IdSchema } from "model";

interface SuccessResult {
  success: true;
  character: Character;
}

interface ErrorResult {
  success: false;
  errorCode: "notFound" | "unexpectedError";
  message?: string;
}

type Result = SuccessResult | ErrorResult;

export async function retrieveCharacter(id: string): Promise<Result> {
  // Validate the parameter
  const parse = IdSchema.safeParse(id);
  if (!parse.success) {
    return { success: false, errorCode: "notFound" };
  }

  // Validate the request
  const characterId: string = parse.data;
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const dataSource: IDataSource = new DataSource();
  const characters = await dataSource.get(DataSets.Characters).find({ id: characterId, userId: user.id });

  if (characters.length === 0) {
    return { success: false, errorCode: "notFound" };
  } else if (characters.length > 1) {
    return { success: false, errorCode: "unexpectedError", message: "Multiple characters found with the same id" };
  } else {
    return { success: true, character: characters[0] };
  }
}
