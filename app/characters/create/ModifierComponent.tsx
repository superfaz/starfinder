import { Badge } from "react-bootstrap";
import { Modifier } from "app/types";
import Skills from "@/data/skills.json";

export default function ModifierComponent({ component }: { component: Modifier }) {
  switch (component.type) {
    case "ability":
      return (
        <p>
          <Badge bg="primary">Pouvoir</Badge>
          {component.name && <strong className="me-1">{component.name}.</strong>}
          <span className="text-muted">{component.description}</span>
        </p>
      );
    case "hitPoints":
      return (
        <p>
          <Badge bg="primary">Points de vie</Badge>
          <strong>
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
          {component.description && <span className="ms-1 text-muted">{component.description}</span>}
        </p>
      );
    case "savingThrow":
      return (
        <p>
          <Badge bg="primary">Jets de sauvegarde</Badge>
          {component.name && <strong className="me-1">{component.name}.</strong>}
          <span className="text-muted">{component.description}</span>
        </p>
      );
    case "skill":
    case "classSkill":
      let skillName: string;
      if (component.target === "any") {
        skillName = "Au choix";
      } else if (component.target === "all") {
        skillName = "Toutes";
      } else {
        let skill = Skills.find((skill) => skill.id === component.target);
        skillName = skill ? skill.name : component.target;
        if (skill === undefined) {
          console.error(`Skill ${component.target} not found`);
        }
      }

      if (component.type === "skill") {
        return (
          <p>
            <Badge bg="primary">Compétence</Badge>
            <strong>
              {skillName} {component.value > 0 ? "+" : ""}
              {component.value}
            </strong>
            <span className="ms-1 text-muted">{component.description}</span>
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
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
        </p>
      );
    case "feat":
      return (
        <p>
          <Badge bg="primary">Don</Badge>
          {component.level && component.level > 1 && <Badge bg="primary">Niveau {component.level}</Badge>}
          <strong className="me-1">{component.name}.</strong>
          <span className="text-muted">{component.description}</span>
        </p>
      );
    case "skillRank":
      return (
        <p>
          <Badge bg="primary">Rang de compétence</Badge>
          <strong>
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
          <span className="ms-1 text-muted">{component.description}</span>
        </p>
      );
    case "spell":
      return (
        <p>
          <Badge bg="primary">Sort</Badge>
          <strong>{component.name}</strong>
          {component.description && <span className="ms-1 text-muted">{component.description}</span>}
        </p>
      );
    case "languageCount":
      return (
        <p>
          <Badge bg="primary">Nombre de langue</Badge>
          <strong>
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
        </p>
      );
    default:
      return null;
  }
}
