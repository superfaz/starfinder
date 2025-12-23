import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { addData, onError, onSuccess, onSuccessGrouped, PromisedResult, start, succeed } from "chain-of-actions";
import { ZodType, ZodTypeDef } from "zod";
import { IDataSource } from "data";
import { DataSourceError, NotFoundError, NotSingleError, ParsingError, UnauthorizedError } from "logic";
import {
  characterService,
  getAuthenticatedUser,
  getDataSource,
  getViewBuilder,
  hasValidInput,
  redirectToSignIn,
} from "logic/server";
import { type Character } from "model";
import { badRequest } from "navigation";

interface IPageContext<Input> {
  input: Input;
  user: KindeUser<Record<string, unknown>>;
  dataSource: IDataSource;
}

interface ICharacterData {
  characterId: string;
}

interface IActionContext<Input> {
  input: Input;
  user: KindeUser<Record<string, unknown>>;
  dataSource: IDataSource;
  character: Character;
}

export async function retrieveCharacter(
  id: string,
  dataSource: IDataSource,
  user: KindeUser<Record<string, unknown>>
): PromisedResult<{ character: Character }, DataSourceError | NotFoundError | NotSingleError> {
  const result = start()
    .withContext({ id, dataSource, user })
    .add(onSuccessGrouped(characterService.retrieveOneForUser))
    .runAsync();

  return result;
}

export function preparePageContext<T, D extends ZodTypeDef, I>(
  redirect: string,
  schema: ZodType<T, D, I>,
  input: T
): PromisedResult<IPageContext<T>, never> {
  return start()
    .add(onSuccess(() => hasValidInput(schema, input)))
    .add(onError(badRequest))
    .add(addData(getAuthenticatedUser))
    .add(onError(() => redirectToSignIn(redirect)))
    .add(addData(getDataSource))
    .add(addData(getViewBuilder))
    .runAsync();
}

export function prepareActionContext<T extends ICharacterData, D extends ZodTypeDef, I>(
  schema: ZodType<T, D, I>,
  input: T
): PromisedResult<
  IActionContext<T> & T,
  DataSourceError | NotFoundError | NotSingleError | ParsingError | UnauthorizedError
> {
  return start()
    .add(onSuccess(() => hasValidInput(schema, input)))
    .add(addData(({ input }: { input: T }) => succeed(input)))
    .add(addData(getAuthenticatedUser))
    .add(addData(getDataSource))
    .add(addData(characterService.retrieveOneForUser))
    .runAsync();
}
