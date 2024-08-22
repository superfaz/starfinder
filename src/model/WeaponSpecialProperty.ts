import type { z } from "zod";
import { IEntrySchema } from "./IEntry";

export const WeaponSpecialPropertySchema = IEntrySchema.extend({
});

export type WeaponSpecialProperty = z.infer<typeof WeaponSpecialPropertySchema>;
