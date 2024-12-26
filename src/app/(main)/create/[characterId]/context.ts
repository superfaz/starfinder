import { PromisedResult, addData, fail, onError, onSuccess, start, succeed } from "chain-of-actions";
import { IDataSource } from "data";
import { NotFoundError, ParsingError, createParsingError, isParsingError } from "logic";
import { characterService, getAuthenticatedUser, getDataSource, hasValidInput } from "logic/server";
import { Character } from "model";
import { ZodType, ZodTypeDef } from "zod";

interface ICharacterActionParams {
  characterId: string;
}

export interface ICharacterActionContext {
  user: { id: string };
  dataSource: IDataSource;
  character: Character;
}

export function prepareActionContext<T extends ICharacterActionParams, D extends ZodTypeDef, I>(
  schema: ZodType<T, D, I>,
  data: unknown
): PromisedResult<ICharacterActionContext, ParsingError> {
  return start()
    .add(onSuccess(() => hasValidInput(schema, data)))
    .add(onSuccess(({ input }) => succeed(input)))
    .add(addData(getAuthenticatedUser))
    .add(addData(getDataSource))
    .add(addData(characterService.retrieveOneForUser))
    .add(
      onError((error) => {
        if (isParsingError(error)) {
          return fail(error);
        } else if (error instanceof NotFoundError) {
          return fail(createParsingError({ characterId: ["Not found"] }));
        } else {
          throw error;
        }
      })
    )
    .runAsync();
}
