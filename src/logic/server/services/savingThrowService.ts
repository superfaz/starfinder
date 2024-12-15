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

export const savingThrowService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "savingThrows") as PromisedResult<{ savingThrows: SavingThrow[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { savingThrowId: string }) =>
    retrieveOne(
      { dataSource: params.dataSource, id: params.savingThrowId },
      descriptor,
      "savingThrow"
    ) as PromisedResult<{ savingThrow: SavingThrow }, DataSourceError | NotFoundError>,
};
