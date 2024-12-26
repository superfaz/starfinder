import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { addData, fail, onError, onSuccess, onSuccessGrouped, PromisedResult, start, succeed } from "chain-of-actions";
import { ZodType, ZodTypeDef } from "zod";
import { IDataSource } from "data";
import { DataSourceError, NotFoundError, NotSingleError, ParsingError, UnauthorizedError } from "logic";
import {
  CharacterBuilder,
  characterService,
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
  const result = start()
    .withContext({ id, dataSource, user })
    .add(onSuccessGrouped(characterService.retrieveOneForUser))
    .add(
      onSuccess((characters) =>
        characters.length === 0 ? fail(new NotFoundError("characters", id)) : succeed(characters)
      )
    )
    .add(onSuccess((characters) => (characters.length > 1 ? fail(new NotSingleError()) : succeed(characters[0]))))
    .add(onSuccess((character) => succeed({ character })))
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
  IActionContext<T>,
  DataSourceError | NotFoundError | NotSingleError | ParsingError | UnauthorizedError
> {
  return start()
    .add(onSuccess(() => hasValidInput(schema, input)))
    .add(addData(getAuthenticatedUser))
    .add(addData(getDataSource))
    .add(addData(({ input, dataSource, user }) => retrieveCharacter(input.characterId, dataSource, user)))
    .add(addData(({ dataSource, character }) => createBuilder(dataSource, character)))
    .runAsync();
}
