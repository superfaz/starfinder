import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Avatar, AvatarSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Avatar> = { mode: "static", type: "simple", name: "avatars", schema: AvatarSchema };

export const avatars = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "avatars") as PromisedResult<{ avatars: Avatar[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "avatar") as PromisedResult<
      { avatar: Avatar },
      DataSourceError | NotFoundError
    >,
};
