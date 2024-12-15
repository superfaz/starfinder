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

export const skills = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "skills") as PromisedResult<{ skills: SkillDefinition[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { classId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.classId }, descriptor, "skill") as PromisedResult<
      { skill: SkillDefinition },
      DataSourceError | NotFoundError
    >,
};
