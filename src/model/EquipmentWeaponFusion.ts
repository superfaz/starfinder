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
  modifiers: z.optional(z.array(FusionModifierSchema)),
});

export type EquipmentWeaponFusion = z.infer<typeof EquipmentWeaponFusionSchema>;
