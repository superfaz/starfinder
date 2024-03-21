import { z } from "zod";
import { DamageTypeIdSchema } from "./DamageType";
import { INamedModelSchema } from "./INamedModel";
import { WeaponCategoryIdSchema } from "./WeaponCategory";
import { WeaponTypeIdSchema } from "./WeaponType";
import { IdSchema, LevelSchema, ReferenceSchema } from "./helper";

export const EquipmentTypeSchema = z.union([z.literal("weapon"), z.literal("armor"), z.literal("other")]);

export type EquipmentType = z.infer<typeof EquipmentTypeSchema>;

export const DamageSchema = z.object({
  roll: z.string().regex(/^\d+d\d+$/),
  types: DamageTypeIdSchema.array(),
});

export type Damage = z.infer<typeof DamageSchema>;

export const CriticalSchema = z.object({ id: IdSchema, value: z.string().optional() });

export type Critical = z.infer<typeof CriticalSchema>;

export const SpecialSchema = z.object({ id: IdSchema, value: z.string().optional() });

export type Special = z.infer<typeof SpecialSchema>;

export const EquipmentBaseSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  level: LevelSchema,
  cost: z.number().int().positive().optional(),
  weight: z.union([z.literal("F"), z.number().positive()]),
});

export type EquipmentBase = z.infer<typeof EquipmentBaseSchema>;

export const EquipmentWeaponMeleeSchema = EquipmentBaseSchema.extend({
  weaponType: WeaponTypeIdSchema,
  hands: z.union([z.literal(1), z.literal(2)]),
  weaponCategory: WeaponCategoryIdSchema.optional(),
  damage: DamageSchema,
  critical: CriticalSchema.optional(),
  specials: SpecialSchema.array(),
});

export type EquipmentWeaponMelee = z.infer<typeof EquipmentWeaponMeleeSchema>;
