import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const BonusCategoryIdSchema = z.enum([
  "untyped",
  "malus",
  "racial",
  "insight",
  "luck",
  "enhancement",
  "moral",
  "divine",
  "circumstance",
  "ability",
]);

export type BonusCategoryId = z.infer<typeof BonusCategoryIdSchema>;

export const BonusCategoryIds = BonusCategoryIdSchema.enum;

export const BonusCategorySchema = INamedModelSchema.extend({
  id: BonusCategoryIdSchema,
  stack: z.boolean(),
});

export type BonusCategory = z.infer<typeof BonusCategorySchema>;

export function isBonusCategory(obj: unknown): obj is BonusCategory {
  return BonusCategorySchema.safeParse(obj).success;
}
