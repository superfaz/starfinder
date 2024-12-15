import { PromisedResult, succeed } from "chain-of-actions";
import { IDataSource, IDynamicDescriptor } from "data";
import { DataSourceError } from "logic/errors";
import { Character, CharacterSchema } from "model";

const descriptor: IDynamicDescriptor<Character> = {
  mode: "dynamic",
  type: "simple",
  name: "characters",
  schema: CharacterSchema,
};

export const characterService = {
  retrieveAllForUser: (params: { dataSource: IDataSource; user: { id: string } }) =>
    params.dataSource.get(descriptor).find({ userId: params.user.id }),

  retrieveOneForUser: (params: { dataSource: IDataSource; characterId: string; user: { id: string } }) =>
    params.dataSource.get(descriptor).find({ id: params.characterId, userId: params.user.id }),

  retrieveLast3Characters: async ({
    dataSource,
    user,
  }: {
    dataSource: IDataSource;
    user: { id: string };
  }): PromisedResult<{ characters: Character[] }, DataSourceError> => {
    const characters = await dataSource.get(descriptor).find({ userId: user.id }, "updateOn", 3);
    if (!characters.success) {
      return characters;
    } else {
      return succeed({ characters: characters.value });
    }
  },

  create: async ({ dataSource, character }: { dataSource: IDataSource; character: Character }) =>
    dataSource.get(descriptor).create(character),

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
