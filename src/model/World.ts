import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { ReferenceSchema } from "./helper";

export const WorldSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  location: z.enum(["pact", "vast"]),
});

export type World = z.infer<typeof WorldSchema>;
