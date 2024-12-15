import { PromisedResult, succeed } from "chain-of-actions";
import { IDataSource, IDynamicDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Character, CharacterSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IDynamicDescriptor<Character> = {
  mode: "dynamic",
  type: "simple",
  name: "characters",
  schema: CharacterSchema,
};

export const characters = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "characters") as PromisedResult<{ characters: Character[] }, DataSourceError>,

  retrieveAllForUser: (params: IRetrieveAllParams & { user: { id: string } }) =>
    params.dataSource.get(descriptor).find({ userId: params.user.id }),

  retrieveOne: (params: IRetrieveAllParams & { id: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.id }, descriptor, "character") as PromisedResult<
      { character: Character },
      DataSourceError | NotFoundError
    >,

  retrieveOneForUser: (params: IRetrieveAllParams & { id: string; user: { id: string } }) =>
    params.dataSource.get(descriptor).find({ id: params.id, userId: params.user.id }),

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

  delete: async ({
    dataSource,
    user,
    id,
  }: {
    dataSource: IDataSource;
    user: { id: string };
    id: string;
  }): PromisedResult<undefined, DataSourceError> => {
    return dataSource.get(descriptor).delete({ id, userId: user.id });
  },
};
