import { Badge } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { Skills } from "data";
import { Modifier } from "model";

const displayLabelsForType: Record<string, string> = {
  ability: "Pouvoir",
  hitPoints: "Points de vie",
  savingThrow: "Jets de sauvegarde",
  skill: "Compétence",
  classSkill: "Compétence de classe",
  featCount: "Nombre de Dons",
  feat: "Don",
  skillRank: "Rang de compétence",
  spell: "Sort",
  languageCount: "Nombre de langue",
  initiative: "Initiative",
};

export default function ModifierComponent({ modifier }: { modifier: Modifier }) {
  const target = modifier.target;
  let skillName: string | undefined;
  if (target === undefined) {
    skillName = undefined;
  } else if (target === "any") {
    skillName = "Au choix";
  } else if (target === "all") {
    skillName = "Toutes";
  } else {
    skillName = findOrError(Skills, (s) => s.id === target).name;
  }

  return (
    <p>
      <Badge bg="primary">{displayLabelsForType[modifier.type] || ""}</Badge>
      {modifier.level && modifier.level > 1 && <Badge bg="primary">Niveau {modifier.level}</Badge>}
      {modifier.name && <strong className="me-2">{modifier.name}.</strong>}
      {skillName && <strong className="me-2">{skillName}</strong>}
      {modifier.value && <strong className="me-2">{displayBonus(modifier.value)}</strong>}
      {modifier.description && <span className="me-2 text-muted">{modifier.description}</span>}
    </p>
  );
}
