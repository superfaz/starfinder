import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { ProfessionSchema } from "./Profession";
import { IdSchema } from "./helper";
import { EquipmentDescriptorSchema } from "./EquipmentDescriptor";
import { IModelSchema } from "./IModel";

export const CharacterSchema = IModelSchema.extend({
  version: z.number(),
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
  homeWorldLanguage: z.string(),
  languages: z.array(z.string()),
  deity: z.string(),
  description: z.string(),
  avatar: z.string(),
  feats: z.array(z.object({ id: IdSchema, target: z.optional(IdSchema) })),
  spells: z.record(z.string(), z.array(IdSchema)),
  initialCapital: z.number(),
  credits: z.number(),
  equipment: z.array(EquipmentDescriptorSchema),
}).strict();

export type Character = z.infer<typeof CharacterSchema>;

export function isCharacter(obj: unknown): obj is Character {
  return CharacterSchema.safeParse(obj).success;
}

export const EmptyCharacter: Readonly<Character> = {
  id: uuidv4(),
  version: 0,
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
  homeWorldLanguage: "",
  languages: [],
  deity: "",
  avatar: "",
  description: "",
  feats: [],
  spells: {},
  initialCapital: 1000,
  credits: 1000,
  equipment: [],
};
