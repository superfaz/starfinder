import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Alignment, AlignmentSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Alignment> = {
  mode: "static",
  type: "ordered",
  name: "alignments",
  schema: AlignmentSchema,
};

export const alignmentService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "alignments") as PromisedResult<{ alignments: Alignment[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { alignmentId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.alignmentId }, descriptor, "alignment") as PromisedResult<
      { alignment: Alignment },
      DataSourceError | NotFoundError
    >,
};
