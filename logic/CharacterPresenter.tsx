import { DataSet } from "data";
import { Character, Class, Race, Theme, Trait, Variant } from "model";

export default class CharacterPresenter {
  private data: DataSet;

  private character: Readonly<Character>;

  private cachedRace: Race | null = null;
  private cachedRaceVariant: Variant | null = null;
  private cachedTraits: Trait[] | null = null;
  private cachedTheme: Theme | null = null;
  private cachedClass: Class | null = null;

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

  getTraits(): Trait[] {
    const race = this.getRace();
    if (!race) {
      return [];
    }

    if (!this.cachedTraits) {
      this.cachedTraits = race.traits.concat(race.secondaryTraits).filter((t) => this.character.traits.includes(t.id));
    }

    return this.cachedTraits;
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
}
