import * as Sentry from "@sentry/nextjs";
import { Badge } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { IClientDataSet } from "data";
import { useAppSelector } from "logic";
import {
  ArmorId,
  FeatModifier,
  FeatTargetTypes,
  Modifier,
  ModifierType,
  hasDescription,
  hasExtra,
  hasName,
  hasValue,
} from "model";

interface ModifierComponentElement {
  level?: number;
  name?: string;
  description?: string;
  value?: number;
  targetName?: string;
  extra?: string;
}

const displayLabelsForType: Record<ModifierType, string> = {
  armorProficiency: "Port d’armure",
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
  weaponProficiency: "Maniement d’arme",
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
    Sentry.captureMessage(`Skill ${target} not found`);
  }

  return skill ? skill.name : target;
}

function adaptForFeat(data: IClientDataSet, modifier: FeatModifier, element: ModifierComponentElement): void {
  const feat = data.feats.find((f) => f.id === modifier.feat);
  if (!feat) {
    Sentry.captureMessage(`Feat ${modifier.feat} not found`);
    return;
  }

  element.name = feat.name;
  element.description = feat.description;

  if (feat.type === "targeted" || feat.type === "multiple") {
    switch (feat.targetType) {
      case FeatTargetTypes.skill:
        element.targetName = retrieveSkillName(data, modifier.target);
        break;
      case FeatTargetTypes.weapon:
        element.targetName = findOrError(data.weapons, modifier.target as ArmorId).name;
        break;
      default:
        //Do nothing
        break;
    }
  }
}

export default function ModifierComponent({ modifier }: Readonly<{ modifier: Modifier }>) {
  const data = useAppSelector((state) => state.data);

  const element: ModifierComponentElement = {
    level: modifier.level && modifier.level > 1 ? modifier.level : undefined,
    name: hasName(modifier) ? modifier.name : undefined,
    description: hasDescription(modifier) ? modifier.description : undefined,
    value: hasValue(modifier) ? modifier.value : undefined,
    extra: hasExtra(modifier) ? modifier.extra : undefined,
  };

  switch (modifier.type) {
    case ModifierType.enum.skill:
    case ModifierType.enum.classSkill:
    case ModifierType.enum.rankSkill:
      // Target is a skill
      element.targetName = retrieveSkillName(data, modifier.target);
      break;

    case ModifierType.enum.feat: {
      adaptForFeat(data, modifier, element);
      break;
    }

    case "spell": {
      // Target is a spell
      const spell = data.spells.find((s) => s.id === modifier.target);
      element.targetName = spell?.name ?? modifier.target;
      break;
    }

    default:
    // Do nothing
  }

  return (
    <p>
      <Badge bg="primary">{displayLabelsForType[modifier.type] ?? ""}</Badge>
      {element.level && <Badge bg="primary">Niveau {element.level}</Badge>}
      {element.name && <strong className="me-2">{element.name}.</strong>}
      {element.targetName && <strong className="me-2">{element.targetName}</strong>}
      {element.value && <strong className="me-2">{displayBonus(element.value)}</strong>}
      <br />
      {element.description && <span className="me-2 text-muted">{element.description}</span>}
      {element.extra && <span className="me-2 text-muted">{element.extra}</span>}
    </p>
  );
}
