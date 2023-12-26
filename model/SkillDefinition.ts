import { IModel } from ".";

export interface SkillDefinition extends IModel {
  id: string;
  name: string;
  abilityScore: string;
  trainedOnly: boolean;
  armorCheckPenalty: boolean;
}
