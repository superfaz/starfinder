import * as Sentry from "@sentry/nextjs";
import { findOrError } from "app/helpers";
import { IClientDataSet } from "data";
import {
  AbilityScoreId,
  AbilityScoreIds,
  ArmorId,
  Avatar,
  Character,
  Class,
  ClassEnvoy,
  ClassMystic,
  ClassOperative,
  ClassSoldier,
  FeatTemplate,
  IModel,
  INamedModel,
  ModifierType,
  Prerequisite,
  PrerequisiteType,
  Race,
  SavingThrow,
  SavingThrowId,
  SkillDefinition,
  Spell,
  Theme,
  Variant,
  WeaponId,
  isCasterId,
  isVariable,
  isWeaponId,
} from "model";
import { Feat, Feature, Modifier, ofType } from "view";
import { getMysticFeatureTemplates, getOperativeFeatureTemplates, getSoldierFeatureTemplates } from "./ClassPresenter";
import { FeatPresenter, Templater, cleanEvolutions } from ".";

/**
 * Computes the minimal ability scores for a specific character.
 *
 * @param data The data set
 * @param character The reference character
 * @returns The minimal ability scores for the specified character
 */
export function computeMinimalAbilityScores(data: IClientDataSet, character: Character): Record<string, number> {
  const selectedRace = data.races.find((r) => r.id === character.race);
  const selectedVariant = selectedRace?.variants.find((v) => v.id === character.raceVariant);
  const selectedTheme = data.themes.find((r) => r.id === character.theme);

  const scores: Record<string, number> = {};
  data.abilityScores.forEach((abilityScore) => {
    let score = 10;

    if (selectedVariant) {
      score += selectedVariant.abilityScores[abilityScore.id] ?? 0;
    }

    if (selectedTheme) {
      score += selectedTheme.abilityScores[abilityScore.id] ?? 0;
    }

    if (
      character.raceVariant === "humans-standard" &&
      character.raceOptions !== undefined &&
      abilityScore.id === character.raceOptions.humanBonus
    ) {
      // Race: Human and Variant: Standard
      score += 2;
    }

    if (
      character.theme === "themeless" &&
      character.themeOptions !== undefined &&
      abilityScore.id === character.themeOptions.noThemeAbility
    ) {
      // Theme: No Theme
      score += 1;
    }

    scores[abilityScore.id] = score;
  });

  return scores;
}

/**
 * Computes the ability score modifier for a specific ability score value.
 *
 * @param abilityScore The ability score value
 * @returns The ability score modifier
 */
export function computeAbilityScoreModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

/**
 * Computes the saving throw bonus provided by a class and based on a specific level.
 *
 * @param classLevel The level of the character in the specific class
 * @param curve The curve to apply ('low' or 'high')
 * @returns The bonus for the specific level and curve
 */
export function computeSavingThrowBonus(classLevel: number, curve: "high" | "low"): number {
  if (curve === "low") {
    return Math.floor(classLevel / 3);
  } else {
    return Math.floor(classLevel / 2) + 2;
  }
}

export function computeBaseAttackBonus(classLevel: number, curve: "high" | "low"): number {
  if (curve === "low") {
    return Math.floor((3 * classLevel) / 4);
  } else {
    return classLevel;
  }
}

export interface SkillPresenter {
  id: string;
  fullName: string;
  abilityScore: AbilityScoreId;
  definition: SkillDefinition;
  ranks: number;
  rankForced: boolean;
  isClassSkill: boolean;
  bonus: number | undefined;
}

export class CharacterPresenter {
  private data: IClientDataSet;
  private classesDetails: Record<string, IModel>;
  private character: Readonly<Character>;

  private cachedRace: Race | null = null;
  private cachedRaceVariant: Variant | null = null;
  private cachedPrimaryRaceTraits: Feature[] | null = null;
  private cachedSecondaryRaceTraits: Feature[] | null = null;
  private cachedSelectedRaceTraits: Feature[] | null = null;
  private cachedTheme: Theme | null = null;
  private cachedClass: Class | null = null;
  private cachedMinimalAbilityScores: Record<string, number> | null = null;
  private cachedRemainingAbilityScoresPoints: number | null = null;
  private cachedClassSkills: string[] | null = null;

  constructor(data: IClientDataSet, classesDetails: Record<string, IModel>, character: Character) {
    this.data = data;
    this.classesDetails = classesDetails;
    this.character = character;
  }

  createTemplater(context: object = {}): Templater {
    const templater = new Templater({
      shirrenObsessionSkill: "any",
      level: this.character.level,
      race: this.character.race,
      theme: this.character.theme,
      class: this.character.class,
      ...this.character.raceOptions,
      ...this.character.themeOptions,
      ...this.character.classOptions,
      ...context,
    });

    const klass = this.getClass();
    if (klass) {
      templater.addToContext("primary", klass.primaryAbilityScore);
    }

    return templater;
  }

  getCharacter(): Readonly<Character> {
    return this.character;
  }

  getRace(): Race | null {
    if (!this.character.race) {
      return null;
    }
    if (!this.cachedRace) {
      this.cachedRace = this.data.races.find((r) => r.id === this.character.race) ?? null;
    }
    return this.cachedRace;
  }

  getRaceVariant(): Variant | null {
    const race = this.getRace();
    if (!race || !this.character.raceVariant) {
      return null;
    }

    if (!this.cachedRaceVariant) {
      this.cachedRaceVariant = race.variants.find((v) => v.id === this.character.raceVariant) ?? null;
    }

    return this.cachedRaceVariant;
  }

  isHumanStandard(): boolean {
    return this.character.raceVariant === "humans-standard";
  }

  getHumanStandardBonus(): string | null {
    return this.character.raceOptions?.humanBonus ?? null;
  }

  getPrimaryRaceTraits(): Feature[] {
    const race = this.getRace();
    if (!race) {
      return [];
    }

    const templater = this.createTemplater();
    if (!this.cachedPrimaryRaceTraits) {
      this.cachedPrimaryRaceTraits = race.traits.map((t) => templater.convertFeature(t));
    }

    return this.cachedPrimaryRaceTraits;
  }

  getSecondaryRaceTraits(): Feature[] {
    const race = this.getRace();
    if (!race) {
      return [];
    }

    const templater = this.createTemplater();
    if (!this.cachedSecondaryRaceTraits) {
      this.cachedSecondaryRaceTraits = race.secondaryTraits.map((t) => templater.convertFeature(t));
    }

    return this.cachedSecondaryRaceTraits;
  }

  getSelectedRaceTraits(): Feature[] {
    const race = this.getRace();
    if (!race) {
      return [];
    }

    const templater = this.createTemplater();
    if (!this.cachedSelectedRaceTraits) {
      this.cachedSelectedRaceTraits = [...race.traits, ...race.secondaryTraits]
        .filter((t) => this.character.traits.includes(t.id))
        .map((t) => templater.convertFeature(t));
    }

    return this.cachedSelectedRaceTraits;
  }

  getTheme(): Theme | null {
    if (!this.character.theme) {
      return null;
    }
    if (!this.cachedTheme) {
      this.cachedTheme = this.data.themes.find((r) => r.id === this.character.theme) ?? null;
    }
    return this.cachedTheme;
  }

  getThemeFeatures(): Feature[] {
    const theme = this.getTheme();
    if (!theme) {
      return [];
    }

    const templater = this.createTemplater();
    return theme.features.map((f) => templater.convertFeature(f));
  }

  hasNoTheme(): boolean {
    return this.character.theme === "themeless";
  }

  getNoThemeAbilityScore(): string | null {
    return this.character.themeOptions?.noThemeAbility ?? null;
  }

  isScholar(): boolean {
    return this.character.theme === "scholar";
  }

  getScholarDetails(): { skill: string; specialization: string } | null {
    const themeOptions = this.character.themeOptions;
    if (!themeOptions?.scholarSkill || themeOptions.scholarSpecialization === undefined) {
      return null;
    }

    return {
      skill: themeOptions.scholarSkill,
      specialization: themeOptions.scholarSpecialization,
    };
  }

  getClass(): Class | null {
    if (!this.character.class) {
      return null;
    }
    if (!this.cachedClass) {
      this.cachedClass = this.data.classes.find((c) => c.id === this.character.class) ?? null;
    }
    return this.cachedClass;
  }

  getClassFeatures(): Feature[] {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return [];
    }

    // Retrieve the class details
    const classDetails = this.classesDetails[selectedClass.id];
    if (!classDetails) {
      return [];
    }

    switch (classDetails.id) {
      case "envoy":
        return (classDetails as ClassEnvoy).features.map((f) => {
          const level = f.level ?? 1;
          const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertFeature(f);
        });

      case "mystic":
        return getMysticFeatureTemplates(classDetails as ClassMystic, this).map((f) => {
          const level = f.level ?? 1;
          const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertFeature(f);
        });

      case "operative": {
        const selectedSpecialization = (classDetails as ClassOperative).specializations.find(
          (s) => s.id === this.getOperativeSpecialization()
        );
        return getOperativeFeatureTemplates(classDetails as ClassOperative, this).map((f) => {
          const level = f.level ?? 1;
          const templater = this.createTemplater({
            ...(selectedSpecialization?.variables ?? {}),
            ...cleanEvolutions(f.evolutions)[level],
          });
          return templater.convertFeature(f);
        });
      }

      case "soldier":
        return getSoldierFeatureTemplates(classDetails as ClassSoldier, this).map((f) => {
          const level = f.level ?? 1;
          const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
          return templater.convertFeature(f);
        });

      default:
        return [];
    }
  }

  getMysticConnection(): string | null {
    return this.character.classOptions?.mysticConnection ?? null;
  }

  getOperativeSpecialization(): string | null {
    return this.character.classOptions?.operativeSpecialization ?? null;
  }

  isSoldier(): boolean {
    return this.character.class === "soldier";
  }

  getSoldierAbilityScore(): string | null {
    return this.character.classOptions?.soldierAbilityScore ?? null;
  }

  getSoldierPrimaryStyle(): string | null {
    return this.character.classOptions?.soldierPrimaryStyle ?? null;
  }

  getAbilityScores(): Record<string, number> {
    return this.character.abilityScores;
  }

  getPrimaryAbilityScore(): string {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return "";
    }

    const templater = this.createTemplater();
    return templater.convertString(selectedClass.primaryAbilityScore);
  }

  getSecondaryAbilityScores(): string[] {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return [];
    }

    const templater = this.createTemplater();
    return selectedClass.secondaryAbilityScores.map((s) => templater.convertString(s));
  }

  getMinimalAbilityScores(): Record<string, number> {
    if (!this.cachedMinimalAbilityScores) {
      this.cachedMinimalAbilityScores = computeMinimalAbilityScores(this.data, this.character);
    }

    return this.cachedMinimalAbilityScores;
  }

  getRemainingAbilityScoresPoints(): number {
    if (!this.cachedRemainingAbilityScoresPoints) {
      let points = 10;
      const abilityScores = this.getAbilityScores();
      const minimalAbilityScores = this.getMinimalAbilityScores();
      this.data.abilityScores.forEach((abilityScore) => {
        const minimalScore = minimalAbilityScores[abilityScore.id];
        if (abilityScores[abilityScore.id] > minimalScore) {
          points -= abilityScores[abilityScore.id] - minimalScore;
        }
      });

      this.cachedRemainingAbilityScoresPoints = points;
    }
    return this.cachedRemainingAbilityScoresPoints;
  }

  /**
   * Retrieves all the modifiers for the current character based on its race, theme, class and level.
   *
   * The provided modifier list is updated to ensure that all templates are managed.
   *
   * @returns The list of modifiers that apply to the character.
   */
  getModifiers(): Modifier[] {
    const selectedRaceTraits = this.getSelectedRaceTraits();
    const themeFeatures = this.getThemeFeatures();
    const classFeatures = this.getClassFeatures();
    const characterFeatures = [...selectedRaceTraits, ...themeFeatures, ...classFeatures];

    return characterFeatures
      .filter((f) => f.level <= this.character.level)
      .map((t) => t.modifiers)
      .flat()
      .filter((t) => t && (t.level === undefined || t.level <= this.character.level));
  }

  getClassSkills(): string[] {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return [];
    }

    if (!this.cachedClassSkills) {
      const modifiers = this.getModifiers();

      const classSkillsFromModifiers = modifiers
        .filter(ofType(ModifierType.enum.classSkill))
        .map((m) => m.target) as string[];
      this.cachedClassSkills = [...classSkillsFromModifiers, ...selectedClass.classSkills];
    }

    return this.cachedClassSkills;
  }

  private prepareSkillPresenters(skills: SkillPresenter[]): SkillPresenter[] {
    const skillModifiers = this.getModifiers().filter(ofType(ModifierType.enum.skill));
    const rankModifiers = this.getModifiers().filter(ofType(ModifierType.enum.rankSkill));

    return skills.map((s) => {
      const rankForced: boolean = rankModifiers.some((m) => m.target === s.id);
      const ranks: number = (this.character.skillRanks[s.id] ?? 0) + (rankForced ? this.character.level : 0);
      const isTrained: boolean = ranks > 0;
      const bonusDoubleClassSkill: number = this.getClassSkills().filter((t) => t === s.id).length > 1 ? 1 : 0;
      const abilityScoreModifier: number = computeAbilityScoreModifier(this.getAbilityScores()[s.abilityScore]);
      const abilityCode = findOrError(this.data.abilityScores, s.abilityScore).code;

      // TODO: Add bonus from modifiers
      const bonusFromSkillModifiers = skillModifiers
        .filter((m) => m.target === s.id || m.target === "all")
        .reduce((acc, m) => acc + m.value, 0);

      function computeSkillBonus() {
        const base = ranks + abilityScoreModifier + bonusFromSkillModifiers + bonusDoubleClassSkill;
        if (s.isClassSkill && isTrained) {
          return base + 3;
        } else if (!isTrained && s.definition.trainedOnly) {
          return undefined;
        } else {
          return base;
        }
      }

      s.fullName = `${s.fullName} (${abilityCode})`;
      s.ranks = ranks;
      s.rankForced = rankForced;
      s.bonus = computeSkillBonus();

      return s;
    });
  }

  private getProfessionSkills(): SkillPresenter[] {
    const professionSkills = this.character.professionSkills;
    const profession = findOrError(this.data.skills, "prof");

    return this.prepareSkillPresenters(
      professionSkills.map((p) => ({
        id: p.id,
        fullName: `${profession.name} ${p.name}`,
        definition: profession,
        abilityScore: p.abilityScore,
        ranks: 0,
        isClassSkill: this.getClassSkills().includes(profession.id),
        rankForced: false,
        bonus: 0,
      }))
    );
  }

  private getGenericSkills(): SkillPresenter[] {
    return this.prepareSkillPresenters(
      this.data.skills
        .filter((s) => s.abilityScore !== undefined)
        .map((s) => ({
          id: s.id,
          fullName: s.name,
          definition: s,
          abilityScore: s.abilityScore as AbilityScoreId,
          ranks: 0,
          isClassSkill: this.getClassSkills().includes(s.id),
          rankForced: false,
          bonus: 0,
        }))
    );
  }

  getSkills(): SkillPresenter[] {
    return [...this.getGenericSkills(), ...this.getProfessionSkills()].sort((a, b) =>
      a.fullName.localeCompare(b.fullName, "fr")
    );
  }

  getRemainingSkillRanksPoints(): number {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return 0;
    }

    // TODO: Check rank calculation
    const ranks = this.getModifiers().filter(ofType(ModifierType.enum.rank)).length;
    const skillRanks = selectedClass.skillRank + computeAbilityScoreModifier(this.getAbilityScores().int) + ranks;

    return skillRanks - Object.values(this.character.skillRanks).reduce((acc, v) => acc + v, 0);
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  checkPrerequisite(prerequisite: Prerequisite): boolean {
    switch (prerequisite.type) {
      case PrerequisiteType.enum.abilityScore: {
        const abilityScore = this.getAbilityScores()[prerequisite.target];
        return abilityScore >= prerequisite.value;
      }

      case PrerequisiteType.enum.armorProficiency: {
        const selectedClass = this.getClass();
        return !!selectedClass && selectedClass.armors.includes(prerequisite.target);
      }

      case PrerequisiteType.enum.arms:
        // TODO: Manage other cases
        return this.character.race === "khasathas";

      case PrerequisiteType.enum.baseAttack: {
        const baseAttack = this.getAttackBonuses()?.base;
        return baseAttack !== undefined && baseAttack >= prerequisite.value;
      }
      case PrerequisiteType.enum.class:
        if (prerequisite.target.startsWith("!")) {
          return this.character.class !== prerequisite.target.substring(1);
        } else {
          return this.character.class === prerequisite.target;
        }

      case PrerequisiteType.enum.combatFeatCount:
        return this.getSelectedFeats().filter((f) => f.combatFeat).length >= prerequisite.value;

      case PrerequisiteType.enum.feat: {
        if (prerequisite.target.startsWith("!")) {
          const target = this.data.feats.find((f) => f.id === prerequisite.target.substring(1));
          return !!target && !this.hasFeat(target);
        } else if (prerequisite.target.startsWith("*")) {
          return this.character.feats.some((f) => f.id.startsWith(prerequisite.target.substring(1)));
        } else {
          const target = findOrError(this.data.feats, prerequisite.target);
          return this.hasFeat(target);
        }
      }

      case PrerequisiteType.enum.level:
        return this.character.level >= prerequisite.value;

      case PrerequisiteType.enum.skillRank: {
        const skill = this.getSkills().find((s) => s.id === prerequisite.target);
        return !!skill && skill.ranks >= prerequisite.value;
      }

      case PrerequisiteType.enum.weaponProficiency: {
        const selectedClass = this.getClass();
        if (isVariable(prerequisite.target)) {
          const target = this.createTemplater().convertString(prerequisite.target);
          if (isWeaponId(target)) {
            return !!selectedClass && selectedClass.weapons.includes(target);
          } else {
            Sentry.captureMessage(
              `Invalid weapon id: ${target} for prerequisite ${prerequisite.id} with value ${prerequisite.target}`
            );
            return false;
          }
        } else if (isWeaponId(prerequisite.target)) {
          return !!selectedClass && selectedClass.weapons.includes(prerequisite.target);
        } else {
          return false;
        }
      }

      case PrerequisiteType.enum.savingThrow:
        return (this.getSavingThrowBonus(prerequisite.target) ?? 0) >= prerequisite.value;

      case PrerequisiteType.enum.notSpellCaster:
        return !isCasterId(this.character.class);

      case PrerequisiteType.enum.spellCaster:
        return isCasterId(this.character.class);

      case PrerequisiteType.enum.spellCasterLevel:
        // TODO: Manage spell caster level
        return true;
    }
  }

  checkPrerequisites(template: FeatTemplate, target?: INamedModel): boolean {
    if (template.prerequisites === undefined || template.prerequisites.length === 0) {
      return true;
    }

    if (template.type === "simple") {
      return template.prerequisites.every((p) => this.checkPrerequisite(p));
    } else if (template.type === "targeted" || template.type === "multiple") {
      const feat = this.createTemplater().convertFeat(template, target);
      return feat.prerequisites.every((p) => this.checkPrerequisite(p));
    } else {
      // @ts-expect-error Will be called only if a new template type is added and not managed
      Sentry.captureMessage(`Invalid feat template type: ${template.type}`);
      return false;
    }
  }

  getName(): string {
    return this.character.name;
  }

  getAlignment(): string {
    return this.character.alignment;
  }

  getSex(): string {
    return this.character.sex;
  }

  getHomeWorld(): string {
    return this.character.homeWorld;
  }

  getDeity(): string {
    return this.character.deity;
  }

  getAvatar(): Avatar | null {
    if (!this.character.avatar) {
      return null;
    } else {
      return findOrError(this.data.avatars, this.character.avatar);
    }
  }

  getAttackBonuses(): { base: number; melee: number; ranged: number; thrown: number } | null {
    const klass = this.getClass();
    if (!klass) {
      return null;
    }

    const base = computeBaseAttackBonus(this.character.level, klass.baseAttack);
    const str = computeAbilityScoreModifier(this.getAbilityScores()["str"]);
    const dex = computeAbilityScoreModifier(this.getAbilityScores()["dex"]);
    return {
      base,
      melee: base + str,
      ranged: base + dex,
      thrown: base + str,
    };
  }

  getArmorProficiencies(): ArmorId[] {
    const selectedClass = this.getClass();
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierType.enum.armorProficiency))
      .map((m) => m.target);

    return [...(selectedClass?.armors ?? []), ...modifiers];
  }

  getWeaponProficiencies(): WeaponId[] {
    const selectedClass = this.getClass();
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierType.enum.weaponProficiency))
      .map((m) => m.target);

    return [...(selectedClass?.weapons ?? []), ...modifiers];
  }

  getSelectedFeats(): Feat[] {
    const templater = this.createTemplater();
    const featPresenter = new FeatPresenter(this.data, this);

    return this.character.feats.map((f) => {
      const featTemplate = findOrError(this.data.feats, (t) => t.id === f.id);
      if (f.target === undefined || featTemplate.type === "simple") {
        return templater.convertFeat(featTemplate);
      } else {
        const options = featPresenter.retrieveOptions(featTemplate.targetType);
        const target = findOrError(options, (o) => o.id === f.target);
        return templater.convertFeat(featTemplate, target);
      }
    });
  }

  hasFeat(feat: FeatTemplate, target?: string): boolean {
    if (target === undefined) {
      return this.character.feats.some((f) => f.id === feat.id);
    } else {
      return this.character.feats.some((f) => f.id === feat.id && f.target === target);
    }
  }

  getSelectableFeatCount(): number {
    const bonus = this.getModifiers()
      .filter(ofType(ModifierType.enum.featCount))
      .reduce((acc, m) => acc + m.value, 0);
    const selected = this.character.feats.length;
    return 1 + bonus - selected;
  }

  getSelectedSpells(): Record<string, Spell[]> {
    const levels = Object.keys(this.character.spells);
    const spells = levels.map((level) => [
      level,
      this.character.spells[level].map((s) => findOrError(this.data.spells, s)),
    ]);
    return Object.fromEntries(spells);
  }

  getSelectableSpellCount(spellLevel: number): number {
    const low = [2, 3, 4, 4, 5];
    const high = [2, 3, 4, 4, 4, 4, 5, 5, 5, 5];

    let max: number;
    if (!isCasterId(this.character.class)) {
      max = 0;
    } else if (spellLevel === 0) {
      max = low[this.character.level + 2] ?? 6;
    } else if (spellLevel === 6) {
      max = this.character.level <= 15 ? 0 : low[this.character.level - 16] ?? 6;
    } else {
      const minLevel = (spellLevel - 1) * 3;
      max = this.character.level <= minLevel ? 0 : high[this.character.level - minLevel - 1] ?? 6;
    }

    return max;
  }

  getInitiative(): number {
    const dex = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.dex]);
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierType.enum.initiative))
      .reduce((acc, m) => acc + m.value, 0);
    return dex + modifiers;
  }

  getStaminaPoints(): number {
    const con = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.con]);
    const klass = this.getClass()?.staminaPoints ?? 0;
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierType.enum.stamina))
      .reduce((acc, m) => acc + m.value, 0);

    return Math.max(0, con + klass + modifiers);
  }

  getHitPoints(): number {
    const race = this.getRace()?.hitPoints ?? 0;
    const klass = this.getClass()?.hitPoints ?? 0;
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierType.enum.hitPoints))
      .reduce((acc, m) => acc + m.value, 0);

    return Math.max(1, race + klass + modifiers);
  }

  getResolvePoints(): number {
    const level = Math.max(1, Math.floor(this.character.level / 2));
    const primaryAbilityScore = this.getPrimaryAbilityScore();
    const primary = primaryAbilityScore ? computeAbilityScoreModifier(this.getAbilityScores()[primaryAbilityScore]) : 0;
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierType.enum.resolve))
      .reduce((acc, m) => acc + m.value, 0);

    return level + primary + modifiers;
  }

  getEnergyArmorClass(): number {
    const dex = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.dex]);
    return 10 + dex;
  }

  getKineticArmorClass(): number {
    const dex = computeAbilityScoreModifier(this.getAbilityScores()[AbilityScoreIds.dex]);
    return 10 + dex;
  }

  getArmorClassAgainstCombatManeuvers(): number {
    return 8 + this.getKineticArmorClass();
  }

  getSavingThrowBonus(savingThrowOrId: SavingThrow | SavingThrowId): number | undefined {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return undefined;
    }

    const savingThrow =
      typeof savingThrowOrId === "string" ? findOrError(this.data.savingThrows, savingThrowOrId) : savingThrowOrId;
    const classBonus = computeSavingThrowBonus(1, selectedClass.savingThrows[savingThrow.id]);
    const abilityScoreBonus = computeAbilityScoreModifier(this.getAbilityScores()[savingThrow.abilityScore]);
    const otherBonus = this.getModifiers()
      .filter(ofType(ModifierType.enum.savingThrowBonus))
      .filter((b) => b.target === savingThrow.id)
      .reduce((a, c) => a + c.value, 0);

    return classBonus + abilityScoreBonus + otherBonus;
  }
}