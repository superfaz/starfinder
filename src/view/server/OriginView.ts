import {
  fail,
  addDataGrouped,
  onSuccess,
  onSuccessGrouped,
  passThroughGrouped,
  PromisedResult,
  start,
  succeed,
} from "chain-of-actions";
import { NotFoundError, Templater } from "logic";
import { type Origin } from "model";
import { OriginFeature } from "view/Feature";
import { type OriginEntry, OriginEntrySchema, OriginView, OriginViewSchema } from "../interfaces";

export function createOriginEntries({
  origins,
}: {
  origins: Origin[];
}): PromisedResult<{ originEntries: OriginEntry[] }> {
  return succeed({ originEntries: origins.map((d) => OriginEntrySchema.parse(d)) });
}

export function createOrigin({
  origin,
  templater,
}: {
  origin: Origin;
  templater: Templater;
}): PromisedResult<{ originView: OriginView }, NotFoundError> {
  return start()
    .withContext({ origin, templater })
    .add(onSuccessGrouped(retrievePrimaryRaceTraits))
    .add(addDataGrouped(retrieveSecondaryRaceTraits))
    .add(
      onSuccessGrouped(({ primaryTraits, secondaryTraits }) =>
        succeed({
          originView: OriginViewSchema.parse({ ...origin, traits: primaryTraits, secondaryTraits }),
        })
      )
    )
    .runAsync();
}

function retrievePrimaryRaceTraits({
  origin,
  templater,
}: {
  origin: Origin;
  templater: Templater;
}): PromisedResult<{ primaryTraits: OriginFeature[] }> {
  return succeed({ primaryTraits: origin.traits.map((t) => templater.convertOriginFeature(t)) });
}

function retrieveSecondaryRaceTraits({
  origin,
  templater,
}: {
  origin: Origin;
  templater: Templater;
}): PromisedResult<{ secondaryTraits: OriginFeature[] }, NotFoundError> {
  return start()
    .withContext({ origin, templater })
    .add(onSuccessGrouped(retrievePrimaryRaceTraits))
    .add(
      addDataGrouped(({ origin, templater }) =>
        succeed({ secondaryTraits: origin.secondaryTraits.map((t) => templater.convertOriginFeature(t)) })
      )
    )
    .add(
      passThroughGrouped(({ origin, primaryTraits, secondaryTraits }) => {
        for (const trait of secondaryTraits) {
          const source = origin.secondaryTraits.find((t) => t.id === trait.id);
          if (source === undefined) {
            return fail(new NotFoundError("traits", trait.id));
          }
          trait.replace =
            source.replace?.map((r) => ({
              id: r,
              name: primaryTraits.find((p) => p.id === r)?.name ?? r,
            })) ?? [];
        }
      })
    )
    .add(onSuccess(({ secondaryTraits }) => succeed({ secondaryTraits })))
    .runAsync();
}
