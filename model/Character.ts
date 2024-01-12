export interface Character {
  level: number;
  race: string;
  raceVariant: string;
  raceOptions?: Record<string, string>;
  theme: string;
  themeOptions?: Record<string, string>;
  class: string;
  classOptions?: Record<string, string>;
  traits: string[];
  traitsOptions?: Record<string, string>;
  abilityScores: Record<string, number>;
  skillRanks: Record<string, number>;
  name: string;
  alignment: string;
  sex: string;
  homeWorld: string;
  deity: string;
  avatar: string;
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
};
