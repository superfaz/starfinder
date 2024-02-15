import { IClientDataSet } from "data";
import { FeatTemplate, INamedModel } from "model";
import { CharacterPresenter } from "./CharacterPresenter";

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
      case "weaponProficiency":
        return this.data.weapons;
      default:
        throw new Error(`Unknown target type: ${targetType}`);
    }
  }

  public getFeatTemplates(): FeatTemplateExtended[] {
    return this.data.feats
      .filter((f) => f.type === "simple" || f.type === "targeted")
      .map((f) => this.buildFeatTemplateExtended(f));
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
    } else {
      throw new Error(`Unknown feat type: ${template.type}`);
    }
  }
}
