import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Avatar, AvatarSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Avatar> = { mode: "static", type: "simple", name: "avatars", schema: AvatarSchema };

export const avatarService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "avatars") as PromisedResult<{ avatars: Avatar[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { avatarId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.avatarId }, descriptor, "avatar") as PromisedResult<
      { avatar: Avatar },
      DataSourceError | NotFoundError
    >,

  findOne: (params: IRetrieveAllParams & { avatarId: string }) =>
    params.dataSource.get(descriptor).findOne(params.avatarId),
};
