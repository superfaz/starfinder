import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";
import { DescriptionSchema, IdSchema, LevelSchema, ReferenceSchema } from "./helper";
import { IModelSchema } from "./IModel";
import { DamageTypeIdSchema } from "./DamageType";

const CriticalFusionModifierSchema = IModelSchema.extend({
  type: z.literal("critical"),
  target: IdSchema,
});
const DamageFusionModifierSchema = IModelSchema.extend({
  type: z.literal("damageType"),
  target: DamageTypeIdSchema,
});
const SpecialFusionModifierSchema = IModelSchema.extend({
  type: z.literal("special"),
  target: IdSchema,
});

export const FusionModifierSchema = z.discriminatedUnion("type", [
  CriticalFusionModifierSchema,
  DamageFusionModifierSchema,
  SpecialFusionModifierSchema,
]);

export const EquipmentWeaponFusionSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  level: LevelSchema,
  description: DescriptionSchema,
  constraint: z.optional(DescriptionSchema),
  modifiers: z.optional(z.array(FusionModifierSchema)),
});

export type EquipmentWeaponFusion = z.infer<typeof EquipmentWeaponFusionSchema>;

export const WeaponFusionCostByLevel = {
  1: 120,
  2: 360,
  3: 440,
  4: 680,
  5: 720,
  6: 1040,
  7: 1560,
  8: 2300,
  9: 2600,
  10: 3580,
  11: 4880,
  12: 6920,
  13: 9760,
  14: 11700,
  15: 17800,
  16: 27000,
  17: 40500,
  18: 60300,
  19: 90000,
  20: 135000,
};
