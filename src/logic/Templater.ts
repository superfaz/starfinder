import {
  isModifierType,
  TemplateEquipment,
  PrerequisiteSchema,
  ModifierSchema,
  type Modifier,
  EquipmentSchema,
} from "model";
import type { FeatTemplate, FeatureTemplate, INamedModel, ModifierTemplate, Prerequisite, Equipment } from "model";
import type { ClassFeature, DroneFeature, Feat, OriginFeature, ThemeFeature } from "view";

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

  convertOriginFeature(template: FeatureTemplate): OriginFeature {
    return {
      ...template,
      source: "origin",
      name: this.applyForString(template.name) ?? "",
      description: template.description ? this.applyForString(template.description) : undefined,
      replace: [],
      modifiers: template.modifiers?.map((m) => this.convertModifier(m)) ?? [],
    };
  }

  convertThemeFeature(template: FeatureTemplate): ThemeFeature {
    return {
      ...template,
      source: "theme",
      name: this.applyForString(template.name) ?? "",
      description: template.description ? this.applyForString(template.description) : undefined,
      modifiers: template.modifiers?.map((m) => this.convertModifier(m)) ?? [],
    };
  }

  convertClassFeature(template: FeatureTemplate): ClassFeature {
    return {
      ...template,
      source: "class",
      name: this.applyForString(template.name) ?? "",
      description: template.description ? this.applyForString(template.description) : undefined,
      evolutions: cleanEvolutions(template.evolutions) ?? {},
      modifiers: template.modifiers?.map((m) => this.convertModifier(m)) ?? [],
    };
  }

  convertDroneFeature(template: FeatureTemplate): DroneFeature {
    return {
      ...template,
      source: "drone",
      name: this.applyForString(template.name) ?? "",
      description: template.description ? this.applyForString(template.description) : undefined,
      modifiers: template.modifiers?.map((m) => this.convertModifier(m)) ?? [],
    };
  }

  convertEquipment(template: TemplateEquipment): Equipment {
    const text = JSON.stringify(template);
    const converted = this.applyForString(text);
    return EquipmentSchema.parse(JSON.parse(converted));
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
      description: template.description !== undefined ? this.applyForString(template.description) : undefined,
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
    return ModifierSchema.parse(JSON.parse(converted));
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
