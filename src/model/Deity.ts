import { z } from "zod";
import { AlignmentIdSchema } from "./Alignment";
import { INamedModelSchema } from "./INamedModel";
import { ReferenceSchema } from "./helper";

export const DeitySchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  alignment: AlignmentIdSchema,
  portfolios: z.string(),
});

export type Deity = z.infer<typeof DeitySchema>;
