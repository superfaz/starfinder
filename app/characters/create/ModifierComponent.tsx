import { Badge } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { Skills } from "data";
import { Modifier } from "model";

export default function ModifierComponent({ modifier }: { modifier: Modifier }) {
  const target = modifier.target;
  const description = modifier.description;
  const value: number = modifier.value ?? 0;

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
          <strong>{displayBonus(value)}</strong>
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
    case "classSkill": {
      let skillName: string;
      if (target === "any") {
        skillName = "Au choix";
      } else if (target === "all") {
        skillName = "Toutes";
      } else {
        skillName = findOrError(Skills, (skill) => skill.id === target).name;
      }

      if (modifier.type === "skill") {
        return (
          <p>
            <Badge bg="primary">Compétence</Badge>
            <strong>
              {skillName} {displayBonus(value)}
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
    }
    case "featCount":
      return (
        <p>
          <Badge bg="primary">Nombre de Dons</Badge>
          <strong>{displayBonus(value)}</strong>
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
            {target && findOrError(Skills, (skill) => skill.id === target).name}
            {displayBonus(value)}
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
          <strong>{displayBonus(value)}</strong>
        </p>
      );
    case "initiative":
      return (
        <p>
          <Badge bg="primary">Initiative</Badge>
          <strong>{displayBonus(value)}</strong>
        </p>
      );
    default:
      return null;
  }
}
