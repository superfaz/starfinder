import { IEntry, IEntrySchema } from "model";

export function createEntry<T extends IEntry>(data: T): IEntry;
export function createEntry<T extends IEntry>(data: T[]): IEntry[];
export function createEntry<T extends IEntry>(data: T[] | T): IEntry[] | IEntry {
  if (!Array.isArray(data)) {
    return IEntrySchema.parse(data);
  } else {
    return data.map((d) => IEntrySchema.parse(d));
  }
}
