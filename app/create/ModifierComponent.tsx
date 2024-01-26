import { Badge } from "react-bootstrap";
import { displayBonus } from "app/helpers";
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

  let targetName: string | undefined;
  switch (modifier.type) {
    case "skill":
    case "classSkill":
    case "rankSkill":
    case "feat":
      // Target is a skill
      if (modifier.target === undefined) {
        targetName = undefined;
      } else if (modifier.target === "any") {
        targetName = "Au choix";
      } else if (modifier.target === "all") {
        targetName = "Toutes";
      } else {
        const skill = data.skills.find((s) => s.id === modifier.target);
        if (!skill) {
          console.error(`Skill ${modifier.target} not found`);
        }
        targetName = skill ? skill.name : modifier.target;
      }
      break;

    case "spell":
      // Target is a spell
      targetName = modifier.target;
      break;

    default:
    // Do nothing
  }

  return (
    <p>
      <Badge bg="primary">{displayLabelsForType[modifier.type] ?? ""}</Badge>
      {modifier.level && modifier.level > 1 && <Badge bg="primary">Niveau {modifier.level}</Badge>}
      {hasName(modifier) && modifier.name && <strong className="me-2">{modifier.name}.</strong>}
      {targetName && <strong className="me-2">{targetName}</strong>}
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
