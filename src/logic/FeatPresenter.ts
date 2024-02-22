import { IClientDataSet } from "data";
import { FeatTemplate, INamedModel, hasLevel } from "model";
import { CharacterPresenter } from "./CharacterPresenter";
import { findOrError } from "app/helpers";

export type FeatOptions = { id: string; name: string; available: boolean };
export type FeatTemplateExtended = FeatTemplate & { visible: boolean; available: boolean; options: FeatOptions[] };

export class FeatPresenter {
  private data: IClientDataSet;
  private character: CharacterPresenter;

  constructor(data: IClientDataSet, character: CharacterPresenter) {
    this.data = data;
    this.character = character;
  }

  /**
   * Retrieves the options for a specific target type.
   *
   * @param targetType The target type.
   * @returns The options for the target type.
   */
  public retrieveOptions(targetType: string): INamedModel[] {
    switch (targetType) {
      case "energyDamageType":
        return this.data.damageTypes.filter((d) => d.category === "energy");
      case "kineticDamageType":
        return this.data.damageTypes.filter((d) => d.category === "kinetic");
      case "weapon":
        return this.data.weapons;
      case "skill":
        return this.data.skills;
      case "specialRangedWeapon":
        return [];
      case "specialMeleeWeapon":
        return [];
      case "combatManeuver":
        return [];
      case "spellLevel0":
        return this.data.spells.filter((s) => hasLevel(s, 0));
      case "spellLevel1":
        return this.data.spells.filter((s) => hasLevel(s, 1));
      case "spellLevel2":
        return this.data.spells.filter((s) => hasLevel(s, 2));
      case "spellLevel3":
        return this.data.spells.filter((s) => hasLevel(s, 3));
      default:
        throw new Error(`Unknown target type: ${targetType}`);
    }
  }

  public getFeatTemplates(): FeatTemplateExtended[] {
    return this.data.feats.map((f) => this.buildFeatTemplateExtended(f));
  }

  public getFeatTemplate(id: string): FeatTemplateExtended {
    const template = findOrError(this.data.feats, (f) => f.id === id);
    return this.buildFeatTemplateExtended(template);
  }

  private buildFeatTemplateExtended(template: FeatTemplate): FeatTemplateExtended {
    if (template.type === "simple") {
      const visible = !template.hidden && !this.character.hasFeat(template);
      const available = this.character.checkPrerequisites(template);
      return {
        ...template,
        visible,
        available,
        options: [],
      };
    } else if (template.type === "targeted") {
      const visible = !template.hidden && !this.character.hasFeat(template);
      const options = this.retrieveOptions(template.targetType).map((target) => ({
        id: target.id,
        name: target.name,
        available: this.character.checkPrerequisites(template, target),
      }));
      const available = options.some((o) => o.available);
      return {
        ...template,
        visible,
        available,
        options,
      };
    } else if (template.type === "multiple") {
      const possibleOptions = this.retrieveOptions(template.targetType);

      const visible = !template.hidden && !possibleOptions.every((o) => this.character.hasFeat(template, o.id));
      const options = possibleOptions.map((target) => ({
        id: target.id,
        name: target.name,
        available: !this.character.hasFeat(template, target.id) && this.character.checkPrerequisites(template, target),
      }));
      const available = options.some((o) => o.available);
      return {
        ...template,
        visible,
        available,
        options,
      };
    } else {
      // @ts-expect-error This should never happen
      throw new Error(`Unknown feat type: ${template.type}`);
    }
  }
}
