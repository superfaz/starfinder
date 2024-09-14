import { type Race } from "model";
import { type RaceEntry, RaceEntrySchema, RaceView, RaceViewSchema } from "../interfaces";

export function createRaceEntry(data: Race[]): RaceEntry[] {
  return data.map((d) => RaceEntrySchema.parse(d));
}

export function createRace(data: Race): RaceView;
export function createRace(data: Race[]): RaceView[];
export function createRace(data: Race[] | Race): RaceView[] | RaceView {
  if (Array.isArray(data)) {
    return data.map((d) => createRace(d));
  }

  return RaceViewSchema.parse(data);
}
