import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema, EvolutionsSchema, ReferenceSchema } from "./helper";

export const CasterId = z.enum(["mystic", "technomancer"]);

export type CasterId = z.infer<typeof CasterId>;

export const CasterIds = CasterId.enum;

export function isCasterId(obj: unknown): obj is CasterId {
  return CasterId.safeParse(obj).success;
}

export const Range = z.object({ min: z.number(), max: z.number() });

export const Spell = INamedModelSchema.extend({
  description: DescriptionSchema,
  reference: ReferenceSchema,
  levels: z.record(CasterId, z.union([z.number(), Range])),
  resolve: z.boolean().default(false),
  evolutions: z.optional(EvolutionsSchema),
});

export type Spell = z.infer<typeof Spell>;

export function isSpell(obj: unknown): obj is Spell {
  return Spell.safeParse(obj).success;
}

export function hasLevel(spell: Spell, level: number): boolean {
  return Object.values(spell.levels).some((v) =>
    typeof v === "number" ? v === level : v.min <= level && v.max >= level
  );
}
