import { PromisedResult, fail, succeed } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { FeatureTemplate, Origin, OriginSchema, Variant } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<Origin> = {
  mode: "static",
  type: "named",
  name: "origins",
  schema: OriginSchema,
};

export const originService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "origins") as PromisedResult<{ origins: Origin[] }, DataSourceError>,

  retrieveOne: (params: IRetrieveAllParams & { originId: string }) =>
    retrieveOne({ dataSource: params.dataSource, id: params.originId }, descriptor, "origin") as PromisedResult<
      { origin: Origin },
      DataSourceError | NotFoundError
    >,

  findOne: (params: IRetrieveAllParams & { originId: string }) =>
    params.dataSource.get(descriptor).findOne(params.originId),

  retrieveVariant: ({
    origin,
    variantId,
  }: {
    origin: Origin;
    variantId: string;
  }): PromisedResult<{ variant: Variant }, NotFoundError> => {
    const variant = origin.variants.find((variant) => variant.id === variantId);
    return variant === undefined ? fail(new NotFoundError("variants", variantId)) : succeed({ variant });
  },

  retrieveSecondaryTrait: ({
    origin,
    traitId,
  }: {
    origin: Origin;
    traitId: string;
  }): PromisedResult<{ trait: FeatureTemplate }, NotFoundError> => {
    const trait = origin.secondaryTraits.find((trait) => trait.id === traitId);
    return trait === undefined ? fail(new NotFoundError("traits", traitId)) : succeed({ trait });
  },
};
