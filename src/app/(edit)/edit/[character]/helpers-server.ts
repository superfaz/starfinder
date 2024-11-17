import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { fail, PromisedResult, start, succeed } from "chain-of-actions";
import { ZodType, ZodTypeDef } from "zod";
import { DataSets, IDataSource } from "data";
import { DataSourceError, NotFoundError, NotSingleError, ParsingError, UnauthorizedError } from "logic";
import {
  CharacterBuilder,
  createBuilder,
  getAuthenticatedUser,
  getDataSource,
  getViewBuilder,
  hasValidInput,
  redirectToSignIn,
} from "logic/server";
import { type Character } from "model";
import { badRequest } from "navigation";
import { ViewBuilder } from "view/server";

interface IPageContext<Input> {
  input: Input;
  user: KindeUser<Record<string, unknown>>;
  dataSource: IDataSource;
  viewBuilder: ViewBuilder;
}

interface ICharacterData {
  characterId: string;
}

interface IActionContext<Input> {
  input: Input;
  user: KindeUser<Record<string, unknown>>;
  dataSource: IDataSource;
  character: Character;
  builder: CharacterBuilder;
}

export async function retrieveCharacter(
  id: string,
  dataSource: IDataSource,
  user: KindeUser<Record<string, unknown>>
): PromisedResult<{ character: Character }, DataSourceError | NotFoundError | NotSingleError> {
  const result = start({ id, dataSource, user })
    .onSuccess((_, { id, dataSource, user }) => dataSource.get(DataSets.Characters).find({ id, userId: user.id }))
    .onSuccess((characters) => (characters.length === 0 ? fail(new NotFoundError()) : succeed(characters)))
    .onSuccess((characters) => (characters.length > 1 ? fail(new NotSingleError()) : succeed(characters[0])))
    .onSuccess((character) => succeed({ character }))
    .runAsync();

  return result;
}

export function preparePageContext<T, D extends ZodTypeDef, I>(
  redirect: string,
  schema: ZodType<T, D, I>,
  input: T
): PromisedResult<IPageContext<T>, never> {
  return start({})
    .addData(() => hasValidInput(schema, input))
    .onError(badRequest)
    .addData(getAuthenticatedUser)
    .onError(() => redirectToSignIn(redirect))
    .addData(getDataSource)
    .addData(getViewBuilder)
    .runAsync();
}

export function prepareActionContext<T extends ICharacterData, D extends ZodTypeDef, I>(
  schema: ZodType<T, D, I>,
  input: T
): PromisedResult<
  IActionContext<T>,
  DataSourceError | NotFoundError | NotSingleError | ParsingError | UnauthorizedError
> {
  return start()
    .onSuccess(() => hasValidInput(schema, input))
    .addData(getAuthenticatedUser)
    .addData(getDataSource)
    .addData(({ input, dataSource, user }) => retrieveCharacter(input.characterId, dataSource, user))
    .addData(({ dataSource, character }) => createBuilder(dataSource, character))
    .runAsync();
}
