import { z } from "zod";
import { EquipmentBaseSchema } from "./EquipmentBase";
import { ArmorTypeIds } from "./ArmorType";
import { DamageSchema } from "./EquipmentWeapon";
import { SizeIdSchema } from "./Size";

export const EquipmentArmorBaseSchema = EquipmentBaseSchema.extend({
  eacBonus: z.number(),
  kacBonus: z.number(),
  maxDexBonus: z.number(),
  armorCheckPenalty: z.number(),
  upgradeSlots: z.number(),
});

export type EquipmentArmorBase = z.infer<typeof EquipmentArmorBaseSchema>;

export const EquipmentArmorLightSchema = EquipmentArmorBaseSchema.extend({
  type: z.literal(ArmorTypeIds.light),
  speedAdjustment: z.number(),
}).strict();

export type EquipmentArmorLight = z.infer<typeof EquipmentArmorLightSchema>;

export const EquipmentArmorHeavySchema = EquipmentArmorBaseSchema.extend({
  type: z.literal(ArmorTypeIds.heavy),
  speedAdjustment: z.number(),
}).strict();

export type EquipmentArmorHeavy = z.infer<typeof EquipmentArmorHeavySchema>;

export const EquipmentArmorPoweredSchema = EquipmentArmorBaseSchema.extend({
  type: z.literal(ArmorTypeIds.powered),
  speed: z.number().positive(),
  strength: z.number().int().positive(),
  damage: DamageSchema,
  size: SizeIdSchema,
  reach: z.number().positive(),
  capacity: z.number().int().positive(),
  usage: z.string(),
  weaponSlots: z.number().int(),
}).strict();

export type EquipmentArmorPowered = z.infer<typeof EquipmentArmorPoweredSchema>;

export const EquipmentArmorSchema = z.discriminatedUnion("type", [
  EquipmentArmorLightSchema,
  EquipmentArmorHeavySchema,
  EquipmentArmorPoweredSchema,
]);

export type EquipmentArmor = z.infer<typeof EquipmentArmorSchema>;
