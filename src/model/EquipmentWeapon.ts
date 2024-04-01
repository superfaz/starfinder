import { z } from "zod";
import { EquipmentBaseSchema, EquipmentTypes } from "./EquipmentBase";
import { WeaponCategoryIdSchema } from "./WeaponCategory";
import { WeaponTypeIds } from "./WeaponType";
import { DamageTypeIdSchema } from "./DamageType";
import { IdSchema } from "./helper";

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

export const EquipmentWeaponIdSchema = z.enum([
  WeaponTypeIds.basic,
  WeaponTypeIds.advanced,
  WeaponTypeIds.small,
  WeaponTypeIds.long,
  WeaponTypeIds.heavy,
  WeaponTypeIds.sniper,
  WeaponTypeIds.grenade,
  "ammunition",
  "solarian",
]);

export type EquipmentWeaponId = z.infer<typeof EquipmentWeaponIdSchema>;

export const EquipmentWeaponIds = EquipmentWeaponIdSchema.enum;

export const EquipmentWeaponAmmunitionSchema = EquipmentBaseSchema.extend({
  type: z.literal(EquipmentTypes.weaponAmmunition),
  category: z.literal("special").optional(),
  capacity: z.number().int().positive(),
  specials: z.string().optional(),
});

export type EquipmentWeaponAmmunition = z.infer<typeof EquipmentWeaponAmmunitionSchema>;

export const EquipmentWeaponSchema = EquipmentBaseSchema.extend({
  hands: z.union([z.literal(1), z.literal(2)]),
  weaponCategory: WeaponCategoryIdSchema.optional(),
  damage: DamageSchema.optional(),
  critical: CriticalSchema.optional(),
  specials: SpecialSchema.array(),
});

export type EquipmentWeapon = z.infer<typeof EquipmentWeaponSchema>;

export const EquipmentWeaponGrenadeSchema = EquipmentBaseSchema.extend({
  type: z.literal(EquipmentTypes.weaponGrenade),
  weaponType: z.enum([WeaponTypeIds.grenade]),
  range: z.number().int().positive(),
  capacity: z.string(),
  specials: SpecialSchema.array(),
});

export type EquipmentWeaponGrenade = z.infer<typeof EquipmentWeaponGrenadeSchema>;

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

export const EquipmentWeaponSolarianSchema = EquipmentBaseSchema.extend({
  type: z.literal(EquipmentTypes.weaponSolarian),
  damage: DamageBonusSchema.optional(),
  critical: CriticalSchema.optional(),
});

export type EquipmentWeaponSolarian = z.infer<typeof EquipmentWeaponSolarianSchema>;
