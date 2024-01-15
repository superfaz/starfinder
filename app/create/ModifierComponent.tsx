import { Badge } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { Modifier, ModifierType } from "model";

const displayLabelsForType: Record<ModifierType, string> = {
  ability: "Pouvoir",
  hitPoints: "Points de vie",
  savingThrow: "Jets de sauvegarde",
  skill: "Compétence",
  classSkill: "Compétence de classe",
  featCount: "Nombre de Dons",
  feat: "Don",
  rank: "Rang de compétence",
  rankSkill: "Rang de compétence",
  spell: "Sort",
  languageCount: "Nombre de langue",
  initiative: "Initiative",
  speed: "Vitesse de déplacement",
};

export default function ModifierComponent({ modifier }: Readonly<{ modifier: Modifier }>) {
  const data = useAppSelector((state) => state.data);

  const skills = data.skills;
  let skillName: string | undefined;
  if (modifier.type === "skill" || modifier.type === "classSkill" || modifier.type === "rankSkill") {
    const target = modifier.target;
    if (target === undefined) {
      skillName = undefined;
    } else if (target === "any") {
      skillName = "Au choix";
    } else if (target === "all") {
      skillName = "Toutes";
    } else {
      skillName = findOrError(skills, (s) => s.id === target).name;
    }
  }

  return (
    <p>
      <Badge bg="primary">{displayLabelsForType[modifier.type] ?? ""}</Badge>
      {modifier.level && modifier.level > 1 && <Badge bg="primary">Niveau {modifier.level}</Badge>}
      {hasName(modifier) && modifier.name && <strong className="me-2">{modifier.name}.</strong>}
      {skillName && <strong className="me-2">{skillName}</strong>}
      {hasValue(modifier) && modifier.value && <strong className="me-2">{displayBonus(modifier.value)}</strong>}
      {hasDescription(modifier) && modifier.description && (
        <span className="me-2 text-muted">{modifier.description}</span>
      )}
    </p>
  );
}

type ModifierWithValue = Extract<Modifier, { value: number }>;

function hasValue(modifier: Modifier): modifier is ModifierWithValue {
  return Object.prototype.hasOwnProperty.call(modifier, "value");
}

type ModifierWithName = Extract<Modifier, { name: string }>;

function hasName(modifier: Modifier): modifier is ModifierWithName {
  return Object.prototype.hasOwnProperty.call(modifier, "name");
}

type ModifierWithDescription = Extract<Modifier, { description: string }>;

function hasDescription(modifier: Modifier): modifier is ModifierWithDescription {
  return Object.prototype.hasOwnProperty.call(modifier, "description");
}
