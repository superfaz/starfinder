import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Size, SizeSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Size> = {
  mode: "static",
  type: "ordered",
  name: "sizes",
  schema: SizeSchema,
};

export const sizeService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "sizes") as PromisedResult<{ sizes: Size[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { sizeId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.sizeId }, descriptor, "size") as PromisedResult<
      { size: Size },
      DataSourceError | NotFoundError
    >,
};
