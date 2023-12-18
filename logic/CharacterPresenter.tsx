import { DataSet } from "data";
import { Avatar, Character, Class, Feature, Modifier, Race, SkillDefinition, Theme, Variant } from "model";
import { Templater } from ".";
import { getOperativeFeatureTemplates } from "./ClassPresenter";
import { findOrError } from "app/helpers";

/**
 * Computes the minimal ability scores for a specific character.
 *
 * @param data The data set
 * @param character The reference character
 * @returns The minimal ability scores for the specified character
 */
export function computeMinimalAbilityScores(data: DataSet, character: Character): Record<string, number> {
  const selectedRace = data.races.find((r) => r.id === character.race) || null;
  const selectedVariant = selectedRace?.variants.find((v) => v.id === character.raceVariant) || null;
  const selectedTheme = data.themes.find((r) => r.id === character.theme) || null;

  const scores: Record<string, number> = {};
  data.abilityScores.forEach((abilityScore) => {
    let score = 10;

    if (selectedVariant) {
      score += selectedVariant.abilityScores[abilityScore.id] || 0;
    }

    if (selectedTheme) {
      score += selectedTheme.abilityScores[abilityScore.id] || 0;
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
      character.theme === "e1a9a6ad-0c95-4f31-a692-3327c77bb53f" &&
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

export class CharacterPresenter {
  private data: DataSet;

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

  constructor(data: DataSet, character: Character) {
    this.data = data;
    this.character = character;
  }

  getCharacter(): Readonly<Character> {
    return this.character;
  }

  getRace(): Race | null {
    if (!this.character.race) {
      return null;
    }
    if (!this.cachedRace) {
      this.cachedRace = this.data.races.find((r) => r.id === this.character.race) || null;
    }
    return this.cachedRace;
  }

  getRaceVariant(): Variant | null {
    const race = this.getRace();
    if (!race || !this.character.raceVariant) {
      return null;
    }

    if (!this.cachedRaceVariant) {
      this.cachedRaceVariant = race.variants.find((v) => v.id === this.character.raceVariant) || null;
    }

    return this.cachedRaceVariant;
  }

  isHumanStandard(): boolean {
    return this.character.raceVariant === "humans-standard";
  }

  getHumanStandardBonus(): string | null {
    return this.character.raceOptions?.humanBonus || null;
  }

  getPrimaryRaceTraits(): Feature[] {
    const race = this.getRace();
    if (!race) {
      return [];
    }

    const templater = new Templater({ race: this.character.race, ...this.character.raceOptions });
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

    const templater = new Templater({ race: this.character.race, ...this.character.raceOptions });
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

    const templater = new Templater({ race: this.character.race, ...this.character.raceOptions });
    if (!this.cachedSelectedRaceTraits) {
      this.cachedSelectedRaceTraits = race.traits
        .concat(race.secondaryTraits)
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
      this.cachedTheme = this.data.themes.find((r) => r.id === this.character.theme) || null;
    }
    return this.cachedTheme;
  }

  getThemeFeatures(): Feature[] {
    const theme = this.getTheme();
    if (!theme) {
      return [];
    }

    const templater = new Templater({
      race: this.character.race,
      theme: this.character.theme,
      ...this.character.raceOptions,
      ...this.character.themeOptions,
    });
    return theme.features.map((f) => templater.convertFeature(f));
  }

  hasNoTheme(): boolean {
    return this.character.theme === "e1a9a6ad-0c95-4f31-a692-3327c77bb53f";
  }

  getNoThemeAbilityScore(): string | null {
    return this.character.themeOptions?.noThemeAbility || null;
  }

  isScholar(): boolean {
    return this.character.theme === "74e471d9-db80-4fae-9610-44ea8eeedcb3";
  }

  getScholarDetails(): { skill: string; specialization: string; label: string } | null {
    const themeOptions = this.character.themeOptions;
    if (!themeOptions || !themeOptions.scholarSkill || themeOptions.scholarSpecialization === undefined) {
      return null;
    }

    const specializations = this.data.specials.scholar[themeOptions.scholarSkill];
    const specialization = specializations.find((s) => s === themeOptions.scholarSpecialization) ?? "";
    const label = specialization === "" ? themeOptions.scholarSpecialization : "";
    return {
      skill: themeOptions.scholarSkill,
      specialization: specialization,
      label: label,
    };
  }

  getClass(): Class | null {
    if (!this.character.class) {
      return null;
    }
    if (!this.cachedClass) {
      this.cachedClass = this.data.classes.find((c) => c.id === this.character.class) || null;
    }
    return this.cachedClass;
  }

  getClassFeatures(): Feature[] {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return [];
    }

    const templater = new Templater({
      race: this.character.race,
      theme: this.character.theme,
      class: this.character.class,
      ...this.character.raceOptions,
      ...this.character.themeOptions,
      ...this.character.classOptions,
    });

    switch (selectedClass.id) {
      case "class-operative":
        return getOperativeFeatureTemplates(this).map((f) => templater.convertFeature(f));
      default:
        return [];
    }
  }

  isSoldier(): boolean {
    return this.character.class === "7d165a8f-d874-4d09-88ff-9f2ccd77a3ab";
  }

  getSoldierAbilityScore(): string | null {
    return this.character.classOptions?.soldierAbilityScore || null;
  }

  getOperativeSpecialization(): string | null {
    return this.character.classOptions?.operativeSpecialization || null;
  }

  getAbilityScores(): Record<string, number> {
    return this.character.abilityScores;
  }

  getPrimaryAbilityScore(): string {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return "";
    }

    const templater = new Templater({
      class: this.character.class,
      ...this.character.classOptions,
    });

    return templater.convertString(selectedClass.primaryAbilityScore);
  }

  getSecondaryAbilityScores(): string[] {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return [];
    }

    const templater = new Templater({
      race: this.character.race,
      ...this.character.classOptions,
    });

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
    const characterFeatures = selectedRaceTraits.concat(themeFeatures).concat(classFeatures);

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

      const classSkillsFromRace = modifiers
        .filter((m) => m.type === "classSkill" && m.target)
        .map((m) => m.target) as string[];
      this.cachedClassSkills = classSkillsFromRace.concat(selectedClass.classSkills);
    }

    return this.cachedClassSkills;
  }

  getSkills(): {
    id: string;
    definition: SkillDefinition;
    ranks: number;
    isClassSkill: boolean;
    bonus: number | undefined;
  }[] {
    return this.data.skills
      .sort((a, b) => a.name.localeCompare(b.name, "fr"))
      .map((s) => {
        const ranks = this.character.skillRanks[s.id] || 0;
        const isTrained = this.character.skillRanks[s.id] !== undefined;
        const isClassSkill = this.getClassSkills().includes(s.id);
        const abilityScoreModifier = computeAbilityScoreModifier(this.getAbilityScores()[s.abilityScore]);

        // TODO: Add modifiers

        function computeSkillBonus() {
          if (isClassSkill && isTrained) {
            return 3 + ranks + abilityScoreModifier;
          } else if (isTrained) {
            return ranks + abilityScoreModifier;
          } else if (s.trainedOnly) {
            return undefined;
          } else {
            return abilityScoreModifier;
          }
        }

        return { id: s.id, definition: s, ranks, isClassSkill, bonus: computeSkillBonus() };
      });
  }

  getRemainingSkillRanksPoints(): number {
    const selectedClass = this.getClass();
    if (!selectedClass) {
      return 0;
    }

    const skillRanks =
      selectedClass.skillRank +
      computeAbilityScoreModifier(this.getAbilityScores().int) +
      this.getModifiers()
        .filter((m) => m.type === "skillRank")
        .reduce((acc, m) => acc + (m.value ?? 0), 0);

    return skillRanks - Object.values(this.character.skillRanks).reduce((acc, v) => acc + v, 0);
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
      return findOrError(this.data.avatars, (a) => a.id === this.character.avatar);
    }
  }
}
