import { z } from "zod";
import { IModel } from "./IModel";
import { ModifierType } from "./ModifierType";
import {
  ArmorProficiencyModifier,
  AbilityModifier,
  ClassSkillModifier,
  FeatModifier,
  RankSkillModifier,
  SavingThrowBonusModifier,
  SavingThrowModifier,
  SpellModifier,
  WeaponProficiencyModifier,
} from "./Modifier";

export const SimpleModifierTemplate = IModel.extend({
  type: z.enum([
    ModifierType.enum.attack,
    ModifierType.enum.featCount,
    ModifierType.enum.hitPoints,
    ModifierType.enum.initiative,
    ModifierType.enum.languageCount,
    ModifierType.enum.rank,
    ModifierType.enum.resolve,
    ModifierType.enum.speed,
    ModifierType.enum.stamina,
  ]),
  level: z.number().optional(),
  value: z.union([z.string(), z.number()]),
});

export const SkillModifierTemplate = IModel.extend({
  type: z.literal(ModifierType.enum.skill),
  level: z.number().optional(),
  target: z.string(),
  value: z.union([z.string(), z.number()]),
});

export const ModifierTemplate = z.discriminatedUnion("type", [
  ArmorProficiencyModifier,
  AbilityModifier,
  ClassSkillModifier,
  FeatModifier,
  RankSkillModifier,
  SimpleModifierTemplate,
  SavingThrowModifier,
  SavingThrowBonusModifier,
  SkillModifierTemplate,
  SpellModifier,
  WeaponProficiencyModifier,
]);

export type ModifierTemplate = z.infer<typeof ModifierTemplate>;

export function isModifierTemplate(obj: unknown): obj is ModifierTemplate {
  return ModifierTemplate.safeParse(obj).success;
}
