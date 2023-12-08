export interface Class {
  id: string;
  name: string;
  description: string;
  refs: string[];
  hitPoints: number;
  staminaPoints: number;
  keyAbilityScore: string | string[];
  secondaryAbilityScore: string[];
  skillRank: number;
  classSkills: string[];
  armors: string[];
  weapons: string[];
}
