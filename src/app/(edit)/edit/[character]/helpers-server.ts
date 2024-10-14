import { fail, PromisedResult, start, succeed } from "chain-of-actions";
import { DataSets } from "data";
import { DataSourceError, NotFoundError, NotSingleError, ParsingError, UnauthorizedError } from "logic";
import { createCharacter, getAuthenticatedUser, getDataSource, hasValidInput } from "logic/server";
import { type Character, IdSchema } from "model";

export async function retrieveCharacter(
  id: string
): PromisedResult<Character, DataSourceError | ParsingError | UnauthorizedError | NotFoundError | NotSingleError> {
  const context = await start({})
    .addData(() => hasValidInput(IdSchema, id))
    .addData(() => getAuthenticatedUser())
    .addData(() => getDataSource())
    .addData(({ user, dataSource }) => succeed({ builder: createCharacter(dataSource, user.id) }))
    .runAsync();

  if (!context.success) {
    return context;
  }

  // Validate the request
  const result = start(undefined, context.value)
    .onSuccess((_, { data, dataSource, user }) =>
      dataSource.get(DataSets.Characters).find({ id: data, userId: user.id })
    )
    .onSuccess((characters) => (characters.length === 0 ? fail(new NotFoundError()) : succeed(characters)))
    .onSuccess((characters) => (characters.length > 1 ? fail(new NotSingleError()) : succeed(characters[0])))
    .runAsync();

  return result;
}
