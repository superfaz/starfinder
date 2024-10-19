import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { fail, PromisedResult, start, succeed } from "chain-of-actions";
import { ZodType, ZodTypeDef } from "zod";
import { DataSets, IDataSource } from "data";
import { DataSourceError, NotFoundError, NotSingleError } from "logic";
import { getAuthenticatedUser, getDataSource, getViewBuilder, hasValidInput, redirectToSignIn } from "logic/server";
import { type Character } from "model";
import { badRequest } from "navigation";
import { ViewBuilder } from "view/server";

interface IContext<Input> {
  input: Input;
  user: KindeUser<Record<string, unknown>>;
  dataSource: IDataSource;
  viewBuilder: ViewBuilder;
}

export function prepareContext<T, D extends ZodTypeDef, I>(
  redirect: string,
  schema: ZodType<T, D, I>,
  input: T
): PromisedResult<IContext<T>, never> {
  return start({})
    .addData(() => hasValidInput(schema, input))
    .onError(badRequest)
    .addData(getAuthenticatedUser)
    .onError(() => redirectToSignIn(redirect))
    .addData(getDataSource)
    .addData(getViewBuilder)
    .runAsync();
}

export async function retrieveCharacter(
  id: string,
  dataSource: IDataSource,
  user: KindeUser<Record<string, unknown>>
): PromisedResult<{ character: Character }, DataSourceError | NotFoundError | NotSingleError> {
  const result = start(undefined, { id, dataSource, user })
    .onSuccess((_, { id, dataSource, user }) => dataSource.get(DataSets.Characters).find({ id, userId: user.id }))
    .onSuccess((characters) => (characters.length === 0 ? fail(new NotFoundError()) : succeed(characters)))
    .onSuccess((characters) => (characters.length > 1 ? fail(new NotSingleError()) : succeed(characters[0])))
    .onSuccess((character) => succeed({ character }))
    .runAsync();

  return result;
}
