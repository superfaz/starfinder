import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { SkillDefinition, SkillDefinitionSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<SkillDefinition> = {
  mode: "static",
  type: "named",
  name: "skills",
  schema: SkillDefinitionSchema,
};

export const skillService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "skills") as PromisedResult<{ skills: SkillDefinition[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { skillId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.skillId }, descriptor, "skill") as PromisedResult<
      { skill: SkillDefinition },
      DataSourceError | NotFoundError
    >,
};
