import { z } from "zod";
import { DamageTypeIdSchema } from "./DamageType";
import { INamedModelSchema } from "./INamedModel";
import { WeaponCategoryIdSchema } from "./WeaponCategory";
import { WeaponTypeIdSchema } from "./WeaponType";
import { IdSchema, LevelSchema, ReferenceSchema } from "./helper";

export const EquipmentWeaponMeleeSchema = INamedModelSchema.extend({
  reference: ReferenceSchema,
  weaponType: WeaponTypeIdSchema,
  hands: z.union([z.literal(1), z.literal(2)]),
  weaponCategory: WeaponCategoryIdSchema.optional(),
  level: LevelSchema,
  cost: z.number().int().positive().optional(),
  damage: z.object({
    roll: z.string().regex(/^\d+d\d+$/),
    types: DamageTypeIdSchema.array(),
  }),
  critical: z.object({ id: IdSchema, value: z.string().optional() }).optional(),
  weight: z.union([z.literal("F"), z.number().positive()]),
  specials: z
    .object({
      id: IdSchema,
      value: z.string().optional(),
    })
    .array(),
});

export type EquipmentWeaponMelee = z.infer<typeof EquipmentWeaponMeleeSchema>;
