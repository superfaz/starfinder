import { Modifier, ModifierTemplate, ModifierType } from "model";

export class Templater {
  private context: Record<string, string | number>;

  constructor(context: Record<string, string | number>) {
    this.context = context;
  }

  apply(template: ModifierTemplate): Modifier {
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
