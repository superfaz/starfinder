import { z } from "zod";
import { EvolutionsSchema } from "./helper";
import { IEntrySchema } from "./IEntry";

export const CasterIdSchema = z.enum(["mystic", "technomancer"]);

export type CasterId = z.infer<typeof CasterIdSchema>;

export const CasterIds = CasterIdSchema.enum;

export function isCasterId(obj: unknown): obj is CasterId {
  return CasterIdSchema.safeParse(obj).success;
}

export const RangeSchema = z.object({ min: z.number(), max: z.number() });

export const SpellSchema = IEntrySchema.extend({
  levels: z.record(CasterIdSchema, z.union([z.number(), RangeSchema])),
  resolve: z.boolean().default(false),
  evolutions: z.optional(EvolutionsSchema),
});

export type Spell = z.infer<typeof SpellSchema>;

export function isSpell(obj: unknown): obj is Spell {
  return SpellSchema.safeParse(obj).success;
}

export function hasLevel(spell: Spell, level: number): boolean {
  return Object.values(spell.levels).some((v) =>
    typeof v === "number" ? v === level : v.min <= level && v.max >= level
  );
}
