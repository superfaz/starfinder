import { IClientDataSet } from "data";
import {
  AbilityScore,
  ArmorId,
  Avatar,
  Character,
  Class,
  ClassEnvoy,
  ClassOperative,
  ClassSoldier,
  FeatTemplate,
  Feature,
  IModel,
  Modifier,
  ModifierType,
  Prerequisite,
  PrerequisiteType,
  Race,
  SkillDefinition,
  Theme,
  Variant,
  WeaponId,
  isVariable,
  isWeaponId,
  ofType,
} from "model";
import { Templater, cleanEvolutions } from ".";
import { getOperativeFeatureTemplates, getSoldierFeatureTemplates } from "./ClassPresenter";
import { findOrError } from "app/helpers";

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
    return new Templater({
      shirrenObsessionSkill: "any",
      race: this.character.race,
      theme: this.character.theme,
      class: this.character.class,
      ...this.character.raceOptions,
      ...this.character.themeOptions,
      ...this.character.classOptions,
      ...context,
    });
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

    if (classDetails.id === "envoy") {
      return (classDetails as ClassEnvoy).features.map((f) => {
        const level = f.level ?? 1;
        const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
        return templater.convertFeature(f);
      });
    } else if (classDetails.id === "operative") {
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
    } else if (classDetails.id === "soldier") {
      return getSoldierFeatureTemplates(classDetails as ClassSoldier, this).map((f) => {
        const level = f.level ?? 1;
        const templater = this.createTemplater(cleanEvolutions(f.evolutions)[level]);
        return templater.convertFeature(f);
      });
    } else {
      return [];
    }
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

  getOperativeSpecialization(): string | null {
    return this.character.classOptions?.operativeSpecialization ?? null;
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

  getSkills(): SkillPresenter[] {
    const skillModifiers = this.getModifiers().filter(ofType(ModifierType.enum.skill));
    const rankModifiers = this.getModifiers().filter(ofType(ModifierType.enum.rankSkill));
    return [...this.data.skills]
      .sort((a, b) => a.name.localeCompare(b.name, "fr"))
      .map((s) => {
        const rankForced: boolean = rankModifiers.some((m) => m.target === s.id);
        const ranks: number = (this.character.skillRanks[s.id] ?? 0) + (rankForced ? this.character.level : 0);
        const isTrained: boolean = ranks > 0;
        const isClassSkill: boolean = this.getClassSkills().includes(s.id);
        const bonusDoubleClassSkill: number = this.getClassSkills().filter((t) => t === s.id).length > 1 ? 1 : 0;
        const abilityScoreModifier: number = !s.abilityScore
          ? 0
          : computeAbilityScoreModifier(this.getAbilityScores()[s.abilityScore]);

        // TODO: Add bonus from modifiers
        const bonusFromSkillModifiers = skillModifiers
          .filter((m) => m.target === s.id || m.target === "all")
          .reduce((acc, m) => acc + m.value, 0);

        function computeSkillBonus() {
          const base = ranks + abilityScoreModifier + bonusFromSkillModifiers + bonusDoubleClassSkill;
          if (isClassSkill && isTrained) {
            return base + 3;
          } else if (!isTrained && s.trainedOnly) {
            return undefined;
          } else {
            return base;
          }
        }

        function computeFullName(abilityScores: AbilityScore[]) {
          if (!s.abilityScore) {
            return s.name;
          }

          const abilityCode = findOrError(abilityScores, s.abilityScore).code;
          return `${s.name} (${abilityCode})`;
        }

        return {
          id: s.id,
          fullName: computeFullName(this.data.abilityScores),
          definition: s,
          ranks,
          isClassSkill,
          rankForced,
          bonus: computeSkillBonus(),
        };
      });
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
            console.error(
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

      case PrerequisiteType.enum.notSpellCaster:
      case PrerequisiteType.enum.spellCaster:
      case PrerequisiteType.enum.savingThrow:
      case PrerequisiteType.enum.spellCasterLevel:
        return true;
    }
  }

  checkPrerequisites(template: FeatTemplate): boolean {
    if (template.prerequisites === undefined) {
      return true;
    }

    if (template.type === "simple") {
      return template.prerequisites.every((p) => this.checkPrerequisite(p));
    } else if (template.type === "targeted") {
      // TODO: manage targeted
      return false;
    } else if (template.type === "multiple") {
      // TODO: manage multiple
      return false;
    } else {
      // @ts-expect-error Will be called only if a new template type is added and not managed
      console.error(`Invalid feat template type: ${template.type}`);
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

  getSelectedFeats(): FeatTemplate[] {
    return this.character.feats
      .map((f) => this.data.feats.find((t) => t.id === f.id))
      .filter((f) => f !== undefined) as FeatTemplate[];
  }

  hasFeat(feat: FeatTemplate): boolean {
    return this.character.feats.some((f) => f.id === feat.id);
  }

  getSelectableFeatCount(): number {
    const bonus = this.getModifiers()
      .filter(ofType(ModifierType.enum.featCount))
      .reduce((acc, m) => acc + m.value, 0);
    const selected = this.character.feats.length;
    return 1 + bonus - selected;
  }

  getInitiative(): number {
    const dex = computeAbilityScoreModifier(this.getAbilityScores()["dex"]);
    const modifiers = this.getModifiers()
      .filter(ofType(ModifierType.enum.initiative))
      .reduce((acc, m) => acc + m.value, 0);
    return dex + modifiers;
  }
}
