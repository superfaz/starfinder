import { type Race } from "model";
import { type RaceEntry, RaceEntrySchema } from "./interfaces";

export function createRaceEntry(data: Race[]): RaceEntry[] {
  return data.map((d) => RaceEntrySchema.parse(d));
}
