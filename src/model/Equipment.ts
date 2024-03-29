import { z } from "zod";
import { DamageTypeIdSchema } from "./DamageType";
import { INamedModelSchema } from "./INamedModel";
import { WeaponCategoryIdSchema } from "./WeaponCategory";
import { WeaponTypeIds } from "./WeaponType";
import { IdSchema, LevelSchema, ReferenceSchema } from "./helper";

export const EquipmentTypeSchema = z.enum([
  "weaponAmmunition",
  "weaponSolarian",
  "weaponMelee",
  "weaponRanged",
  "weaponGrenade",
  "armor",
  "other",
]);

export type EquipmentType = z.infer<typeof EquipmentTypeSchema>;

export const EquipmentTypes = EquipmentTypeSchema.enum;

export const DamageSchema = z.object({
  roll: z.string().regex(/^\d+d\d+$/),
  types: DamageTypeIdSchema.array(),
});

export type Damage = z.infer<typeof DamageSchema>;

export const DamageBonusSchema = z.object({
  roll: z.string().regex(/^\+\d+d\d+$/),
  types: DamageTypeIdSchema.array(),
});

export type DamageBonus = z.infer<typeof DamageBonusSchema>;

export const CriticalSchema = z.object({ id: IdSchema, value: z.string().optional() });

export type Critical = z.infer<typeof CriticalSchema>;

export const SpecialSchema = z.object({ id: IdSchema, value: z.string().optional() });

export type Special = z.infer<typeof SpecialSchema>;

export const EquipmentBaseSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  level: LevelSchema,
  cost: z.number().int().positive().optional(),
  weight: z.union([z.literal("F"), z.number().positive()]).optional(),
});

export type EquipmentBase = z.infer<typeof EquipmentBaseSchema>;

export const EquipmentAmmunitionSchema = EquipmentBaseSchema.extend({
  type: z.literal(EquipmentTypes.weaponAmmunition),
  category: z.literal("special").optional(),
  capacity: z.number().int().positive(),
  specials: z.string().optional(),
});

export type EquipmentAmmunition = z.infer<typeof EquipmentAmmunitionSchema>;

export const EquipmentSolarianSchema = EquipmentBaseSchema.extend({
  type: z.literal(EquipmentTypes.weaponSolarian),
  damage: DamageBonusSchema.optional(),
  critical: CriticalSchema.optional(),
});

export const EquipmentWeaponSchema = EquipmentBaseSchema.extend({
  hands: z.union([z.literal(1), z.literal(2)]),
  weaponCategory: WeaponCategoryIdSchema.optional(),
  damage: DamageSchema.optional(),
  critical: CriticalSchema.optional(),
  specials: SpecialSchema.array(),
});

export type EquipmentWeapon = z.infer<typeof EquipmentWeaponSchema>;

export const EquipmentWeaponMeleeSchema = EquipmentWeaponSchema.extend({
  type: z.literal(EquipmentTypes.weaponMelee),
  weaponType: z.enum([WeaponTypeIds.basic, WeaponTypeIds.advanced]),
});

export type EquipmentWeaponMelee = z.infer<typeof EquipmentWeaponMeleeSchema>;

export const EquipmentWeaponRangedSchema = EquipmentWeaponSchema.extend({
  type: z.literal(EquipmentTypes.weaponRanged),
  weaponType: z.enum([WeaponTypeIds.small, WeaponTypeIds.long, WeaponTypeIds.heavy, WeaponTypeIds.sniper]),
  range: z.number().int().positive(),
  ammunition: z.object({
    type: z.string(),
    capacity: z.number().int().positive(),
    usage: z.number().int().positive(),
  }),
});

export type EquipmentWeaponRanged = z.infer<typeof EquipmentWeaponRangedSchema>;

export const EquipmentWeaponGrenadeSchema = EquipmentBaseSchema.extend({
  type: z.literal(EquipmentTypes.weaponGrenade),
  weaponType: z.enum([WeaponTypeIds.grenade]),
  range: z.number().int().positive(),
  capacity: z.string(),
  specials: SpecialSchema.array(),
});

export type EquipmentWeaponGrenade = z.infer<typeof EquipmentWeaponGrenadeSchema>;

export const EquipementSchema = z.discriminatedUnion("type", [
  EquipmentAmmunitionSchema,
  EquipmentSolarianSchema,
  EquipmentWeaponMeleeSchema,
  EquipmentWeaponRangedSchema,
  EquipmentWeaponGrenadeSchema,
]);

export type Equipment = z.infer<typeof EquipementSchema>;
