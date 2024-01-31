import { Badge } from "react-bootstrap";
import { displayBonus } from "app/helpers";
import { IClientDataSet } from "data";
import { useAppSelector } from "logic";
import { Modifier, ModifierType, hasDescription, hasExtra, hasName, hasValue } from "model";

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

function retrieveSkillName(data: IClientDataSet, target: string | undefined): string | undefined {
  if (target === undefined) {
    return undefined;
  }

  if (target === "any") {
    return "Au choix";
  }

  if (target === "all") {
    return "Toutes";
  }

  const skill = data.skills.find((s) => s.id === target);
  if (!skill) {
    console.error(`Skill ${target} not found`);
  }

  return skill ? skill.name : target;
}

export default function ModifierComponent({ modifier }: Readonly<{ modifier: Modifier }>) {
  const data = useAppSelector((state) => state.data);

  let name: string | undefined = hasName(modifier) ? modifier.name : undefined;
  let description: string | undefined = hasDescription(modifier) ? modifier.description : undefined;
  let targetName: string | undefined;
  switch (modifier.type) {
    case ModifierType.enum.skill:
    case ModifierType.enum.classSkill:
    case ModifierType.enum.rankSkill:
      // Target is a skill
      targetName = retrieveSkillName(data, modifier.target);
      break;

    case ModifierType.enum.feat: {
      const feat = data.feats.find((f) => f.id === modifier.feat);
      if (feat) {
        name = feat.name;
        description = feat.description;
        if (feat.type === "targeted" || feat.type === "multiple") {
          switch (feat.targetType) {
            case "skill":
              // Target is a skill
              targetName = retrieveSkillName(data, modifier.target);
              break;
          }
        }
      } else {
        console.error(`Feat ${modifier.feat} not found`);
      }

      break;
    }

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
      {name && <strong className="me-2">{name}.</strong>}
      {targetName && <strong className="me-2">{targetName}</strong>}
      {hasValue(modifier) && modifier.value && <strong className="me-2">{displayBonus(modifier.value)}</strong>}
      <br />
      {description && <span className="me-2 text-muted">{description}</span>}
      {hasExtra(modifier) && modifier.extra && <span className="me-2 text-muted">{modifier.extra}</span>}
    </p>
  );
}
