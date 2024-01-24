import { Badge } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { Modifier, ModifierType } from "model";

const displayLabelsForType: Record<ModifierType, string> = {
  attack: "Bonus de base à l’attaque",
  ability: "Pouvoir",
  classSkill: "Compétence de classe",
  feat: "Don",
  featCount: "Nombre de Dons",
  hitPoints: "Points de vie",
  initiative: "Initiative",
  languageCount: "Nombre de langue",
  rank: "Rang de compétence",
  rankSkill: "Rang de compétence",
  resolve: "Points de persévérance",
  savingThrow: "Jets de sauvegarde",
  savingThrowBonus: "Jets de sauvegarde",
  skill: "Compétence",
  speed: "Vitesse de déplacement",
  spell: "Sort",
  stamina: "Points d'endurance",
};

export default function ModifierComponent({ modifier }: Readonly<{ modifier: Modifier }>) {
  const data = useAppSelector((state) => state.data);

  const skills = data.skills;
  let skillName: string | undefined;
  if (
    modifier.type === "skill" ||
    modifier.type === "classSkill" ||
    modifier.type === "rankSkill" ||
    modifier.type === "feat"
  ) {
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
      {hasExtra(modifier) && modifier.extra && <span className="me-2 text-muted">{modifier.extra}</span>}
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

type ModifierWithExtra = Extract<Modifier, { extra?: string }>;

function hasExtra(modifier: Modifier): modifier is ModifierWithExtra {
  return Object.prototype.hasOwnProperty.call(modifier, "extra");
}
