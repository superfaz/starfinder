import { DataSet } from "data";
import { Character, Class, Race, Theme, Variant } from "model";

export default class CharacterPresenter {
  private data: DataSet;

  private character: Readonly<Character>;

  private cachedRace: Race | null = null;
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
    if (!this.character.race || !this.character.raceVariant) {
      return null;
    }

    return this.getRace()?.variants.find((v) => v.id === this.character.raceVariant) || null;
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

  getClass(): Class | null {
    if (!this.character.class) {
      return null;
    }
    if (!this.cachedClass) {
      this.cachedClass = this.data.classes.find((c) => c.id === this.character.class) || null;
    }
    return this.cachedClass;
  }
}
