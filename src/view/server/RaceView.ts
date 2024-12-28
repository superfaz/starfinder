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
import { type Race } from "model";
import { RaceFeature } from "view/Feature";
import { type RaceEntry, RaceEntrySchema, RaceView, RaceViewSchema } from "../interfaces";

export function createRaceEntries({ races }: { races: Race[] }): PromisedResult<{ raceEntries: RaceEntry[] }> {
  return succeed({ raceEntries: races.map((d) => RaceEntrySchema.parse(d)) });
}

export function createRace({
  race,
  templater,
}: {
  race: Race;
  templater: Templater;
}): PromisedResult<{ raceView: RaceView }, NotFoundError> {
  return start()
    .withContext({ race, templater })
    .add(onSuccessGrouped(retrievePrimaryRaceTraits))
    .add(addDataGrouped(retrieveSecondaryRaceTraits))
    .add(
      onSuccessGrouped(({ primaryTraits, secondaryTraits }) =>
        succeed({
          raceView: RaceViewSchema.parse({ ...race, traits: primaryTraits, secondaryTraits }),
        })
      )
    )
    .runAsync();
}

function retrievePrimaryRaceTraits({
  race,
  templater,
}: {
  race: Race;
  templater: Templater;
}): PromisedResult<{ primaryTraits: RaceFeature[] }> {
  return succeed({ primaryTraits: race.traits.map((t) => templater.convertRaceFeature(t)) });
}

function retrieveSecondaryRaceTraits({
  race,
  templater,
}: {
  race: Race;
  templater: Templater;
}): PromisedResult<{ secondaryTraits: RaceFeature[] }, NotFoundError> {
  return start()
    .withContext({ race, templater })
    .add(onSuccessGrouped(retrievePrimaryRaceTraits))
    .add(
      addDataGrouped(({ race, templater }) =>
        succeed({ secondaryTraits: race.secondaryTraits.map((t) => templater.convertRaceFeature(t)) })
      )
    )
    .add(
      passThroughGrouped(({ race, primaryTraits, secondaryTraits }) => {
        for (const trait of secondaryTraits) {
          const source = race.secondaryTraits.find((t) => t.id === trait.id);
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
