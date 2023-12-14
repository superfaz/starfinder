export class Character {
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

  constructor() {
    this.level = 1;
    this.race = "";
    this.raceVariant = "";
    this.theme = "";
    this.class = "";
    this.traits = [];
    this.abilityScores = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
    this.skillRanks = {};
  }
}
