import { z } from "zod";
import { ProfessionSchema } from "./Profession";
import { IdSchema } from "./helper";
import { EquipmentTypeSchema } from "./Equipment";

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
    equipment: z.array(
      z.object({ type: EquipmentTypeSchema, secondaryType: IdSchema, id: IdSchema, quantity: z.number() })
    ),
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
  equipment: [],
};
