import { type z } from "zod";
import { IEntrySchema } from "./IEntry";

export const CriticalHitEffectSchema = IEntrySchema.extend({});

export type CriticalHitEffect = z.infer<typeof CriticalHitEffectSchema>;
