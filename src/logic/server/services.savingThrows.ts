import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { SavingThrow, SavingThrowSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<SavingThrow> = {
  mode: "static",
  type: "ordered",
  name: "saving-throws",
  schema: SavingThrowSchema,
};

export const savingThrows = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "savingThrows") as PromisedResult<{ savingThrows: SavingThrow[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "savingThrow") as PromisedResult<
      { savingThrow: SavingThrow },
      DataSourceError | NotFoundError
    >,
};
