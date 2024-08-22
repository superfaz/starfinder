import type { IEntry, IRaceEntry, Race } from "model";
import { IEntrySchema, IRaceEntrySchema } from "model";

export function forSelect<T extends IEntry>(data: T[]): IEntry[] {
  return data.map((d) => IEntrySchema.parse(d));
}

export function forSelectRace(data: Race[]): IRaceEntry[] {
  return data.map((d) => IRaceEntrySchema.parse(d));
}
