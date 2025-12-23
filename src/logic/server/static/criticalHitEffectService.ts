import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { CriticalHitEffect, CriticalHitEffectSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<CriticalHitEffect> = {
  mode: "static",
  type: "named",
  name: "critical-hit-effects",
  schema: CriticalHitEffectSchema,
};

export const criticalHitEffectService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "criticalHitEffects") as PromisedResult<
      { criticalHitEffects: CriticalHitEffect[] },
      DataSourceError
    >,

  retrieveOne: (params: IRetrieveAllParams & { criticalHitEffectId: string }) =>
    retrieveOne(
      { dataSource: params.dataSource, id: params.criticalHitEffectId },
      descriptor,
      "criticalHitEffect"
    ) as PromisedResult<{ criticalHitEffect: CriticalHitEffect }, DataSourceError | NotFoundError>,
};
