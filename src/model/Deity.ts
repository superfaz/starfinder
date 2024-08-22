import { z } from "zod";
import { IEntrySchema } from "./IEntry";

export const DeitySchema = IEntrySchema.extend({
  portfolios: z.string(),
});

export type Deity = z.infer<typeof DeitySchema>;
