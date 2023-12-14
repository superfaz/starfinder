import { Feature, FeatureTemplate, Modifier, ModifierTemplate, ModifierType } from "model";

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
      name: this.applyForString(template.name) || "",
      description: this.applyForString(template.description),
      modifiers: [],
      category: template.category as "ex" | "ma" | "su" | undefined,
      evolutions: cleanEvolutions(template.evolutions) || {},
      replace: template.replace || [],
    };

    if (template.modifiers) {
      result.modifiers = template.modifiers.map((m) => this.convertModifier(m));
    }

    return result;
  }

  convertModifier(template: ModifierTemplate): Modifier {
    if (!Object.keys(ModifierType).includes(template.type)) {
      throw new Error(`Invalid modifier type: ${template.type}`);
    }

    const type = template.type as ModifierType;
    return {
      ...template,
      type,
      target: this.applyForString(template.target),
      description: this.applyForString(template.description),
      value: this.applyForNumber(template.value),
    };
  }

  convertString(text: string): string {
    return this.applyForString(text) || "";
  }

  private applyForString(template: string | undefined): string | undefined {
    if (typeof template === "undefined") {
      return undefined;
    }

    let result = template;
    Object.keys(this.context).forEach((key) => {
      result = result.replaceAll(`<${key}>`, this.context[key]?.toString() || "");
    });

    return result;
  }

  private applyForNumber(template: string | number | undefined): number | undefined {
    if (typeof template === "undefined") {
      return undefined;
    }
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
