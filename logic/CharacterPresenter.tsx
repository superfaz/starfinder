import { DataSet } from "data";
import { Character, Class, Modifier, Race, SkillDefinition, Theme, Trait, Variant } from "model";

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

  let scores: Record<string, number> = {};
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
  private cachedRaceTraits: Trait[] | null = null;
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

  getRaceTraits(): Trait[] {
    const race = this.getRace();
    if (!race) {
      return [];
    }

    if (!this.cachedRaceTraits) {
      this.cachedRaceTraits = race.traits
        .concat(race.secondaryTraits)
        .filter((t) => this.character.traits.includes(t.id));
    }

    return this.cachedRaceTraits;
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
    if (!this.character.themeOptions) {
      return null;
    }

    return {
      skill: this.character.themeOptions.scholarSkill,
      specialization: this.character.themeOptions.scholarSpecialization,
      label: this.character.themeOptions.scholarLabel,
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
        let minimalScore = minimalAbilityScores[abilityScore.id];
        if (abilityScores[abilityScore.id] > minimalScore) {
          points -= abilityScores[abilityScore.id] - minimalScore;
        }
      });

      this.cachedRemainingAbilityScoresPoints = points;
    }
    return this.cachedRemainingAbilityScoresPoints;
  }

  getModifiers(): Modifier[] {
    const selectedTheme = this.getTheme();
    const selectedRaceTraits = this.getRaceTraits();
    const themeTraits = selectedTheme?.features || [];
    const characterTraits = selectedRaceTraits.concat(themeTraits);

    return characterTraits
      .map((t) => t.modifiers)
      .flat()
      .filter((t) => t && (t.level === undefined || t.level <= 1)) as Modifier[];
  }

  getClassSkills(): string[] {
    if (!this.cachedClassSkills) {
      const selectedClass = this.getClass();
      const modifiers = this.getModifiers();

      const classSkillsFromRace = modifiers
        .filter((m) => m.type === "classSkill" && m.target)
        .map((m) => m.target) as string[];
      this.cachedClassSkills = classSkillsFromRace.concat(selectedClass?.classSkills || []);
    }

    return this.cachedClassSkills;
  }

  getSkills(): { id: string; definition: SkillDefinition; ranks: number; isClassSkill: boolean; bonus: number | undefined }[] {
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

    const skillRanks =
      (selectedClass?.skillRank || 0) +
      computeAbilityScoreModifier(this.getAbilityScores().int) +
      this.getModifiers()
        .filter((m) => m.type === "skillRank")
        .reduce((acc, m) => acc + (typeof m.value === "number" ? m.value : 0), 0);

    return skillRanks - Object.values(this.character.skillRanks).reduce((acc, v) => acc + v, 0);
  }
}
