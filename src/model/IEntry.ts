import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema, ReferenceSchema } from "./helper";

export const IEntrySchema = INamedModelSchema.extend({
  description: DescriptionSchema,
  reference: ReferenceSchema,
});

export type IEntry = z.infer<typeof IEntrySchema>;

export function isEntry(obj: unknown): obj is IEntry {
  return IEntrySchema.safeParse(obj).success;
}