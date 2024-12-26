import { PromisedResult, succeed } from "chain-of-actions";
import { type Race } from "model";
import { type RaceEntry, RaceEntrySchema, RaceView, RaceViewSchema } from "../interfaces";

export function createRaceEntries({ races }: { races: Race[] }): PromisedResult<{ raceEntries: RaceEntry[] }> {
  return succeed({ raceEntries: races.map((d) => RaceEntrySchema.parse(d)) });
}

export function createRace({ race }: { race: Race }): PromisedResult<{ raceView: RaceView }> {
  return succeed({ raceView: RaceViewSchema.parse(race as unknown) });
}
