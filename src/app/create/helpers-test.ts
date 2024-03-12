import { IClientDataSet } from "data";
import { updators } from "logic";
import {
  AbilityScoreSchema,
  AlignmentSchema,
  ArmorTypeSchema,
  AvatarSchema,
  BookSchema,
  ClassSchema,
  DamageTypeSchema,
  EmptyCharacter,
  FeatTemplateSchema,
  ProfessionSchema,
  RaceSchema,
  SavingThrowSchema,
  SkillDefinitionSchema,
  SpellSchema,
  ThemeSchema,
  WeaponCategorySchema,
  WeaponTypeSchema,
} from "model";

import abilityScores from "../../../mocks/ability-scores.json";
import alignments from "../../../mocks/alignments.json";
import armorTypes from "../../../mocks/armor-types.json";
import books from "../../../mocks/books.json";
import avatars from "../../../mocks/avatars.json";
import classes from "../../../mocks/classes.json";
import damageTypes from "../../../mocks/damage-types.json";
import feats from "../../../mocks/feats.json";
import professions from "../../../mocks/professions.json";
import races from "../../../mocks/races.json";
import spells from "../../../mocks/spells.json";
import themes from "../../../mocks/themes.json";
import savingThrows from "../../../mocks/saving-throws.json";
import skills from "../../../mocks/skills.json";
import weaponCategories from "../../../mocks/weapon-categories.json";
import weaponTypes from "../../../mocks/weapon-types.json";

const data: IClientDataSet = {
  abilityScores: AbilityScoreSchema.array().parse(abilityScores),
  alignments: AlignmentSchema.array().parse(alignments),
  armorTypes: ArmorTypeSchema.array().parse(armorTypes),
  books: BookSchema.array().parse(books),
  avatars: AvatarSchema.array().parse(avatars),
  classes: ClassSchema.array().parse(classes),
  damageTypes: DamageTypeSchema.array().parse(damageTypes),
  feats: FeatTemplateSchema.array().parse(feats),
  professions: ProfessionSchema.array().parse(professions),
  races: RaceSchema.array().parse(races),
  spells: SpellSchema.array().parse(spells),
  themes: ThemeSchema.array().parse(themes),
  savingThrows: SavingThrowSchema.array().parse(savingThrows),
  skills: SkillDefinitionSchema.array().parse(skills),
  weaponCategories: WeaponCategorySchema.array().parse(weaponCategories),
  weaponTypes: WeaponTypeSchema.array().parse(weaponTypes),
};

export function createCharacter() {
  return updators(data, EmptyCharacter);
}

export type Updator = ReturnType<typeof createCharacter>;
