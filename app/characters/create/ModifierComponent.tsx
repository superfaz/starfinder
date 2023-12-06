import { Badge } from "react-bootstrap";
import { Modifier } from "app/types";
import Skills from "@/data/skills.json";
import { Context } from "./types";

/**
 * Replace all '<key>' in text by context[key] if it exists.
 *
 * @param context context to use
 * @param text text to update
 * @returns updated text
 */
export function replace(context: Context, text: string | undefined): string {
  if (text === undefined) {
    return "";
  }

  let result = text;
  if (context && text) {
    Object.keys(context).forEach((key) => {
      result = result.replaceAll(`<${key}>`, context[key]?.toString() || `<${key}>`);
    });
  }

  return result;
}

function findOrError<T>(array: T[], predicate: (value: T) => boolean): T {
  let result = array.find(predicate);
  if (result === undefined) {
    throw new Error("Can't find element in array");
  }
  return result;
}

export default function ModifierComponent({ modifier, context }: { modifier: Modifier; context?: Context }) {
  let target = replace(context || {}, modifier.target);
  let description = replace(context || {}, modifier.description);
  let value: number =
    typeof modifier.value === "string"
      ? parseInt(replace(context || {}, modifier.value as string))
      : (modifier.value as number);

  switch (modifier.type) {
    case "ability":
      return (
        <p>
          <Badge bg="primary">Pouvoir</Badge>
          {modifier.name && <strong className="me-1">{modifier.name}.</strong>}
          <span className="text-muted">{description}</span>
        </p>
      );
    case "hitPoints":
      return (
        <p>
          <Badge bg="primary">Points de vie</Badge>
          <strong>
            {value > 0 ? "+" : ""}
            {value}
          </strong>
          {description && <span className="ms-1 text-muted">{description}</span>}
        </p>
      );
    case "savingThrow":
      return (
        <p>
          <Badge bg="primary">Jets de sauvegarde</Badge>
          {modifier.name && <strong className="me-1">{modifier.name}.</strong>}
          <span className="text-muted">{description}</span>
        </p>
      );
    case "skill":
    case "classSkill":
      let skillName: string;
      if (target === "any") {
        skillName = "Au choix";
      } else if (target === "all") {
        skillName = "Toutes";
      } else {
        let skill = Skills.find((skill) => skill.id === target);
        skillName = skill ? skill.name : target;
        if (skill === undefined) {
          console.error(`Skill '${modifier.target}' not found`);
        }
      }

      if (modifier.type === "skill") {
        return (
          <p>
            <Badge bg="primary">Compétence</Badge>
            <strong>
              {skillName} {value > 0 ? "+" : ""}
              {value}
            </strong>
            <span className="ms-1 text-muted">{description}</span>
          </p>
        );
      } else {
        return (
          <p>
            <Badge bg="primary">Compétence de classe</Badge>
            <strong>{skillName}</strong>
          </p>
        );
      }

    case "featCount":
      return (
        <p>
          <Badge bg="primary">Nombre de Dons</Badge>
          <strong>
            {value > 0 ? "+" : ""}
            {value}
          </strong>
        </p>
      );
    case "feat":
      return (
        <p>
          <Badge bg="primary">Don</Badge>
          {modifier.level && modifier.level > 1 && <Badge bg="primary">Niveau {modifier.level}</Badge>}
          <strong className="me-1">
            {modifier.name}
            {target && " " + findOrError(Skills, (s) => s.id === target).name}.
          </strong>
          <span className="text-muted">{description}</span>
        </p>
      );
    case "skillRank":
      return (
        <p>
          <Badge bg="primary">Rang de compétence</Badge>
          <strong>
            {target && findOrError(Skills, (skill) => skill.id === target).name} {value > 0 ? "+" : ""}
            {value}
          </strong>
          <span className="ms-1 text-muted">{description}</span>
        </p>
      );
    case "spell":
      return (
        <p>
          <Badge bg="primary">Sort</Badge>
          <strong>{modifier.name}</strong>
          {description && <span className="ms-1 text-muted">{description}</span>}
        </p>
      );
    case "languageCount":
      return (
        <p>
          <Badge bg="primary">Nombre de langue</Badge>
          <strong>
            {value > 0 ? "+" : ""}
            {value}
          </strong>
        </p>
      );
    case "initiative":
      return (
        <p>
          <Badge bg="primary">Initiative</Badge>
          <strong>
            {value > 0 ? "+" : ""}
            {value}
          </strong>
        </p>
      );
    default:
      return null;
  }
}