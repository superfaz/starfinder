import { IEntry, IEntrySchema } from "model";

export function createEntry<T extends IEntry>(data: T[]): IEntry[] {
  return data.map((d) => IEntrySchema.parse(d));
}
