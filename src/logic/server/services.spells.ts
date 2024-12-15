import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { Spell, SpellSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Spell> = {
  mode: "static",
  type: "named",
  name: "spells",
  schema: SpellSchema,
};

export const spells = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "spells") as PromisedResult<{ spells: Spell[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "spell") as PromisedResult<
      { spell: Spell },
      DataSourceError | NotFoundError
    >,
};
