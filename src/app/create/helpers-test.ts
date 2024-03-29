import { render } from "@testing-library/react";
import { IClientDataSet } from "data";
import { updators } from "logic";
import {
  AbilityScoreSchema,
  AlignmentSchema,
  ArmorTypeSchema,
  AvatarSchema,
  BookSchema,
  Character,
  ClassSchema,
  CriticalHitEffectSchema,
  DamageTypeSchema,
  EmptyCharacter,
  FeatTemplateSchema,
  IModel,
  ProfessionSchema,
  RaceSchema,
  SavingThrowSchema,
  SkillDefinitionSchema,
  SpellSchema,
  ThemeSchema,
  WeaponCategorySchema,
  WeaponSpecialPropertySchema,
  WeaponTypeSchema,
} from "model";
import { LayoutServer } from "./layout";

import abilityScores from "../../../mocks/ability-scores.json";
import alignments from "../../../mocks/alignments.json";
import armorTypes from "../../../mocks/armor-types.json";
import avatars from "../../../mocks/avatars.json";
import books from "../../../mocks/books.json";
import classes from "../../../mocks/classes.json";
import criticalHitEffects from "../../../mocks/critical-hit-effects.json";
import damageTypes from "../../../mocks/damage-types.json";
import feats from "../../../mocks/feats.json";
import professions from "../../../mocks/professions.json";
import races from "../../../mocks/races.json";
import spells from "../../../mocks/spells.json";
import themes from "../../../mocks/themes.json";
import savingThrows from "../../../mocks/saving-throws.json";
import skills from "../../../mocks/skills.json";
import weaponCategories from "../../../mocks/weapon-categories.json";
import weaponSpecialProperties from "../../../mocks/weapon-special-properties.json";
import weaponTypes from "../../../mocks/weapon-types.json";
import envoyClassDetails from "../../../mocks/class-envoy.json";
import operativeClassDetails from "../../../mocks/class-operative.json";
import soldierClassDetails from "../../../mocks/class-soldier.json";

const data: IClientDataSet = {
  abilityScores: AbilityScoreSchema.array().parse(abilityScores),
  alignments: AlignmentSchema.array().parse(alignments),
  armorTypes: ArmorTypeSchema.array().parse(armorTypes),
  avatars: AvatarSchema.array().parse(avatars),
  books: BookSchema.array().parse(books),
  classes: ClassSchema.array().parse(classes),
  criticalHitEffects: CriticalHitEffectSchema.array().parse(criticalHitEffects),
  damageTypes: DamageTypeSchema.array().parse(damageTypes),
  feats: FeatTemplateSchema.array().parse(feats),
  professions: ProfessionSchema.array().parse(professions),
  races: RaceSchema.array().parse(races),
  spells: SpellSchema.array().parse(spells),
  themes: ThemeSchema.array().parse(themes),
  savingThrows: SavingThrowSchema.array().parse(savingThrows),
  skills: SkillDefinitionSchema.array().parse(skills),
  weaponCategories: WeaponCategorySchema.array().parse(weaponCategories),
  weaponSpecialProperties: WeaponSpecialPropertySchema.array().parse(weaponSpecialProperties),
  weaponTypes: WeaponTypeSchema.array().parse(weaponTypes),
};

const classesDetails: Record<string, IModel> = {
  envoy: envoyClassDetails,
  operative: operativeClassDetails,
  soldier: soldierClassDetails,
};

export function createCharacter() {
  return updators(data, EmptyCharacter);
}

export type Updator = ReturnType<typeof createCharacter>;

export async function renderWithData(children: React.ReactNode, character?: Character) {
  return render(await LayoutServer({ children, character, classesDetails }));
}
