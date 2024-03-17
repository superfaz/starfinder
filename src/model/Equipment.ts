import { z } from "zod";
import { DamageTypeIdSchema } from "./DamageType";
import { INamedModelSchema } from "./INamedModel";
import { WeaponCategoryIdSchema } from "./WeaponCategory";
import { WeaponTypeIdSchema } from "./WeaponType";
import { IdSchema, LevelSchema, ReferenceSchema } from "./helper";

export const DamageSchema = z.object({
  roll: z.string().regex(/^\d+d\d+$/),
  types: DamageTypeIdSchema.array(),
});

export type Damage = z.infer<typeof DamageSchema>;

export const CriticalSchema = z.object({ id: IdSchema, value: z.string().optional() });

export type Critical = z.infer<typeof CriticalSchema>;

export const SpecialSchema = z.object({ id: IdSchema, value: z.string().optional() });

export type Special = z.infer<typeof SpecialSchema>;

export const EquipmentWeaponMeleeSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  weaponType: WeaponTypeIdSchema,
  hands: z.union([z.literal(1), z.literal(2)]),
  weaponCategory: WeaponCategoryIdSchema.optional(),
  level: LevelSchema,
  cost: z.number().int().positive().optional(),
  damage: DamageSchema,
  critical: CriticalSchema.optional(),
  weight: z.union([z.literal("F"), z.number().positive()]),
  specials: SpecialSchema.array(),
});

export type EquipmentWeaponMelee = z.infer<typeof EquipmentWeaponMeleeSchema>;
