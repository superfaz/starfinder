import { z } from "zod";
import { ProfessionSchema } from "./Profession";
import { IdSchema } from "./helper";
import { EquipmentCategorySchema } from "./EquipmentBase";

export const ConsumableEquipmentDescriptorSchema = z.object({
  id: IdSchema,
  type: z.literal("consumable"),
  category: EquipmentCategorySchema,
  secondaryType: IdSchema,
  equipmentId: IdSchema,
  quantity: z.number(),
  unitaryCost: z.number(),
});

export type ConsumableEquipmentDescriptor = z.infer<typeof ConsumableEquipmentDescriptorSchema>;

export const UniqueEquipmentDescriptorSchema = z.object({
  id: IdSchema,
  type: z.literal("unique"),
  category: EquipmentCategorySchema,
  secondaryType: IdSchema,
  equipmentId: IdSchema,
  quantity: z.literal(1),
  unitaryCost: z.number(),
});

export type UniqueEquipmentDescriptor = z.infer<typeof UniqueEquipmentDescriptorSchema>;

export const EquipmentDescriptorSchema = z.discriminatedUnion("type", [
  ConsumableEquipmentDescriptorSchema,
  UniqueEquipmentDescriptorSchema,
]);

export type EquipmentDescriptor = z.infer<typeof EquipmentDescriptorSchema>;

export const CharacterSchema = z
  .object({
    level: z.number(),
    race: z.string(),
    raceVariant: z.string(),
    raceOptions: z.optional(z.record(z.string())),
    theme: z.string(),
    themeOptions: z.optional(z.record(z.string())),
    class: z.string(),
    classOptions: z.optional(z.record(z.string())),
    traits: z.array(z.string()),
    traitsOptions: z.optional(z.record(z.string())),
    abilityScores: z.record(z.number()),
    professionSkills: z.array(ProfessionSchema),
    skillRanks: z.record(z.number()),
    name: z.string(),
    alignment: z.string(),
    sex: z.string(),
    homeWorld: z.string(),
    deity: z.string(),
    description: z.string(),
    avatar: z.string(),
    feats: z.array(z.object({ id: IdSchema, target: z.optional(IdSchema) })),
    spells: z.record(z.string(), z.array(IdSchema)),
    initialCapital: z.number(),
    credits: z.number(),
    equipment: z.array(EquipmentDescriptorSchema),
  })
  .strict();

export type Character = z.infer<typeof CharacterSchema>;

export function isCharacter(obj: unknown): obj is Character {
  return CharacterSchema.safeParse(obj).success;
}

export const EmptyCharacter: Readonly<Character> = {
  level: 1,
  race: "",
  raceVariant: "",
  theme: "",
  class: "",
  traits: [],
  abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  professionSkills: [],
  skillRanks: {},
  name: "",
  alignment: "",
  sex: "",
  homeWorld: "",
  deity: "",
  avatar: "",
  description: "",
  feats: [],
  spells: {},
  initialCapital: 1000,
  credits: 1000,
  equipment: [],
};
