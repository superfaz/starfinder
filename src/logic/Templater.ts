import {
  type FeatTemplate,
  type FeatureTemplate,
  type INamedModel,
  type ModifierTemplate,
  type Prerequisite,
  isModifierType,
  EquipmentWeapon,
  EquipmentWeaponSchema,
  TemplateEquipment,
  PrerequisiteSchema,
} from "model";
import { ClassFeature, Feat, Modifier, RaceFeature, ThemeFeature } from "view";

export function cleanEvolutions(
  evolutions: Record<string, Record<string, string | number | null | undefined> | null | undefined> | undefined
): Record<string, Record<string, string | number>> {
  if (!evolutions) {
    return {};
  }

  const result: Record<string, Record<string, string | number>> = {};
  Object.entries(evolutions).forEach(([level, values]) => {
    result[level] = {};
    if (values) {
      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          result[level][key] = value;
        }
      });
    }
  });

  return result;
}

export class Templater {
  private context: Record<string, string | number>;

  constructor(context: Record<string, string | number>) {
    this.context = context;
  }

  addToContext(key: string, value: string | number): void {
    if (typeof value === "string") {
      this.context[key] = this.convertString(value);
    } else {
      this.context[key] = value;
    }
  }

  convertRaceFeature(template: FeatureTemplate): RaceFeature {
    return {
      ...template,
      source: "race",
      name: this.applyForString(template.name) ?? "",
      description: template.description ? this.applyForString(template.description) : undefined,
      category: template.category,
      replace: template.replace ?? [],
      modifiers: template.modifiers?.map((m) => this.convertModifier(m)) ?? [],
    };
  }

  convertThemeFeature(template: FeatureTemplate): ThemeFeature {
    return {
      ...template,
      source: "theme",
      name: this.applyForString(template.name) ?? "",
      description: template.description ? this.applyForString(template.description) : undefined,
      category: template.category,
      modifiers: template.modifiers?.map((m) => this.convertModifier(m)) ?? [],
    };
  }

  convertClassFeature(template: FeatureTemplate): ClassFeature {
    return {
      ...template,
      source: "class",
      name: this.applyForString(template.name) ?? "",
      description: template.description ? this.applyForString(template.description) : undefined,
      category: template.category,
      evolutions: cleanEvolutions(template.evolutions) ?? {},
      modifiers: template.modifiers?.map((m) => this.convertModifier(m)) ?? [],
    };
  }

  convertEquipment(template: TemplateEquipment): EquipmentWeapon {
    const text = JSON.stringify(template);
    const converted = this.applyForString(text);
    return EquipmentWeaponSchema.parse(JSON.parse(converted));
  }

  convertFeat(template: FeatTemplate, target?: INamedModel): Feat {
    if (target !== undefined) {
      this.context.target = target.id;
      this.context.targetName = target.name;
    } else {
      delete this.context.target;
      delete this.context.targetName;
    }

    const result: Feat = {
      ...template,
      target: target?.id,
      name: this.applyForString(template.name),
      description: this.applyForString(template.description),
      modifiers: [],
      prerequisites: [],
    };

    if (target !== undefined) {
      result.name += " - " + target.name;
    }

    if (template.prerequisites) {
      result.prerequisites = template.prerequisites.map((p) => this.convertPrerequisite(p));
    }
    if (template.modifiers) {
      result.modifiers = template.modifiers.map((m) => this.convertModifier(m));
    }

    return result;
  }

  convertModifier(template: ModifierTemplate): Modifier {
    if (!isModifierType(template.type)) {
      throw new Error(`Invalid modifier type: ${template.type}`);
    }

    const text = JSON.stringify(template);
    const converted = this.applyForString(text);
    const result = Modifier.safeParse(JSON.parse(converted));
    if (result.success) {
      return result.data;
    } else {
      console.log(template);
      throw new Error(`Failed to convert modifier: ${result.error.errors}`);
    }
  }

  convertPrerequisite(template: Prerequisite): Prerequisite {
    const text = JSON.stringify(template);
    const converted = this.applyForString(text);
    return PrerequisiteSchema.parse(JSON.parse(converted));
  }

  convertString(text: string): string {
    return this.applyForString(text) ?? "";
  }

  private applyForString(template: string): string {
    let result = template;
    Object.keys(this.context).forEach((key) => {
      result = result.replaceAll(`<${key}>`, this.context[key]?.toString() ?? "");
    });

    return result;
  }

  private applyForNumber(template: string | number): number {
    if (typeof template === "number") {
      return template;
    }

    const text = this.applyForString(template);
    if (text === undefined) {
      throw new Error(`Invalid number template: ${template}`);
    }

    return parseInt(text);
  }
}
