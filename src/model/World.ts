import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { IdSchema, ReferenceSchema } from "./helper";

export const WorldSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  location: z.enum(["pact", "vast"]),
  language: z.optional(IdSchema),
});

export type World = z.infer<typeof WorldSchema>;
