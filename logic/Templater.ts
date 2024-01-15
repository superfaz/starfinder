import { Feature, FeatureTemplate, Modifier, ModifierTemplate, ModifierType, isModifierType } from "model";

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

  convertFeature(template: FeatureTemplate): Feature {
    const result: Feature = {
      ...template,
      name: this.applyForString(template.name) ?? "",
      description: template.description ? this.applyForString(template.description) : undefined,
      modifiers: [],
      category: template.category,
      evolutions: cleanEvolutions(template.evolutions) ?? {},
      replace: template.replace ?? [],
    };

    if (template.modifiers) {
      result.modifiers = template.modifiers.map((m) => this.convertModifier(m));
    }

    return result;
  }

  convertModifier(template: ModifierTemplate): Modifier {
    if (!isModifierType(template.type)) {
      throw new Error(`Invalid modifier type: ${template.type}`);
    }

    switch (template.type) {
      case ModifierType.enum.ability:
      case ModifierType.enum.savingThrow:
        return {
          ...template,
          description: this.applyForString(template.description),
        };
      case ModifierType.enum.classSkill:
      case ModifierType.enum.rankSkill:
        return {
          ...template,
          target: this.applyForString(template.target),
        };
      case ModifierType.enum.featCount:
      case ModifierType.enum.hitPoints:
      case ModifierType.enum.initiative:
      case ModifierType.enum.languageCount:
      case ModifierType.enum.rank:
      case ModifierType.enum.speed:
        return {
          ...template,
          value: this.applyForNumber(template.value),
        };
      case ModifierType.enum.skill:
        return {
          ...template,
          target: this.applyForString(template.target),
          value: this.applyForNumber(template.value),
        };
      case ModifierType.enum.spell:
      case ModifierType.enum.feat:
      default:
        return {
          ...template,
        };
    }
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
