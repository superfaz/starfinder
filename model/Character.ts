import { z } from "zod";

export const Character = z
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
    skillRanks: z.record(z.number()),
    name: z.string(),
    alignment: z.string(),
    sex: z.string(),
    homeWorld: z.string(),
    deity: z.string(),
    avatar: z.string(),
    feats: z.array(z.object({ id: z.string() })),
  })
  .strict();

export type Character = z.infer<typeof Character>;

export function isCharacter(obj: unknown): obj is Character {
  return Character.safeParse(obj).success;
}

export const EmptyCharacter: Readonly<Character> = {
  level: 1,
  race: "",
  raceVariant: "",
  theme: "",
  class: "",
  traits: [],
  abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  skillRanks: {},
  name: "",
  alignment: "",
  sex: "",
  homeWorld: "",
  deity: "",
  avatar: "",
  feats: [],
};
