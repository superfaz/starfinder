import { z } from "zod";
import { INamedModel } from "./INamedModel";
import { Description, Evolutions } from "./helper";

export const CasterId = z.enum(["mystic", "technomancer"]);

export type CasterId = z.infer<typeof CasterId>;

export const CasterIds = CasterId.enum;

export const Range = z.object({ min: z.number(), max: z.number() });

export const Spell = INamedModel.extend({
  description: Description,
  refs: z.array(z.string()),
  levels: z.record(CasterId, z.union([z.number(), Range])),
  resolve: z.boolean().default(false),
  evolutions: z.optional(Evolutions),
});