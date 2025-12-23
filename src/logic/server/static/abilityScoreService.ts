import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { AbilityScore, AbilityScoreSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<AbilityScore> = {
  mode: "static",
  type: "ordered",
  name: "ability-scores",
  schema: AbilityScoreSchema,
};

export const abilityScoreService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "abilityScores") as PromisedResult<
      { abilityScores: AbilityScore[] },
      DataSourceError
    >,

  retrieveOne: (params: IRetrieveAllParams & { abilityScoreId: string }) =>
    retrieveOne(
      { dataSource: params.dataSource, id: params.abilityScoreId },
      descriptor,
      "abilityScore"
    ) as PromisedResult<{ abilityScore: AbilityScore }, DataSourceError | NotFoundError>,
};
