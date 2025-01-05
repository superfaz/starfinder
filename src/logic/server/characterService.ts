import { fail, onSuccess, passThrough, PromisedResult, start, succeed } from "chain-of-actions";
import { IDataSource, IDynamicDescriptor } from "data";
import { DataSourceError, NotFoundError, NotSingleError, ParsingError } from "logic/errors";
import { Character, CharacterSchema } from "model";

const descriptor: IDynamicDescriptor<Character> = {
  mode: "dynamic",
  type: "simple",
  name: "characters",
  schema: CharacterSchema,
};

export const characterService = {
  retrieveAllForUser: (params: { dataSource: IDataSource; user: { id: string } }) =>
    start()
      .add(() => succeed(descriptor))
      .add(onSuccess((descriptor) => succeed(params.dataSource.get(descriptor))))
      .add(onSuccess((dataSet) => dataSet.find({ userId: params.user.id })))
      .add(onSuccess((characters) => succeed({ characters })))
      .runAsync(),

  retrieveOneForUser: (params: { dataSource: IDataSource; characterId: string; user: { id: string } }) =>
    start()
      .add(() => succeed(descriptor))
      .add(onSuccess((descriptor) => succeed(params.dataSource.get(descriptor))))
      .add(onSuccess((dataSet) => dataSet.find({ userId: params.user.id, id: params.characterId })))
      .add(passThrough((characters) => (characters.length > 1 ? fail(new NotSingleError()) : succeed(undefined))))
      .add(
        onSuccess((characters) =>
          characters.length === 0
            ? fail(new NotFoundError(descriptor.name, params.characterId))
            : succeed({ character: characters[0] })
        )
      )
      .runAsync(),

  findNewForUser: (params: { dataSource: IDataSource; user: { id: string } }) =>
    start()
      .add(() => succeed(descriptor))
      .add(onSuccess((descriptor) => succeed(params.dataSource.get(descriptor))))
      .add(onSuccess((dataSet) => dataSet.find({ userId: params.user.id })))
      .add(passThrough((characters) => (characters.length > 1 ? fail(new NotSingleError()) : succeed(undefined))))
      .add(onSuccess((characters) => succeed({ character: characters.length === 0 ? undefined : characters[0] })))
      .runAsync(),

  retrieveLast3Characters: async ({
    dataSource,
    user,
  }: {
    dataSource: IDataSource;
    user: { id: string };
  }): PromisedResult<{ characters: Character[] }, ParsingError | DataSourceError> => {
    const characters = await dataSource.get(descriptor).find({ userId: user.id }, "updateOn", 3);
    if (!characters.success) {
      return characters;
    } else {
      return succeed({ characters: characters.value });
    }
  },

  create: async ({ dataSource, character }: { dataSource: IDataSource; character: Character }) =>
    dataSource.get(descriptor).create(character),

  update: async ({ dataSource, character }: { dataSource: IDataSource; character: Character }) => {
    character.updatedAt = new Date().toISOString();
    return start()
      .add(onSuccess(() => dataSource.get(descriptor).update(character)))
      .add(onSuccess((character) => succeed({ character })))
      .runAsync();
  },

  delete: async ({
    dataSource,
    user,
    characterId,
  }: {
    dataSource: IDataSource;
    user: { id: string };
    characterId: string;
  }): PromisedResult<undefined, DataSourceError> => {
    return dataSource.get(descriptor).delete({ id: characterId, userId: user.id });
  },
};
