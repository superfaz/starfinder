import * as Sentry from "@sentry/nextjs";
import { Badge } from "app/components";
import { displayBonus, findOrError } from "app/helpers";
import { IClientDataSet } from "data";
import { CharacterPresenter, useAppSelector } from "logic";
import {
  FeatTargetTypes,
  type ModifierType,
  ModifierTypes,
  hasDescription,
  hasExtra,
  hasName,
  hasValue,
  FeatModifier,
  EquipmentModifier,
  Modifier,
  hasCategory,
} from "model";
import { DisplayDamageLong, DisplaySpecials } from "./equipment/Components";
import { useCharacterPresenter } from "./helpers-client";

interface ModifierComponentElement {
  level?: number;
  name?: string;
  description?: string;
  category?: string;
  value?: number;
  targetName?: string;
  extra?: string;
}

const displayLabelsForType: Record<ModifierType, string> = {
  ability: "Pouvoir",
  abilityScore: "Caractéristique",
  armorCheckPenalty: "Malus d’armure aux tests",
  armorClass: "Classe d’armure",
  armorProficiency: "Port d’armure",
  armorSpeedAdjustment: "Modificateur de vitesse d’armure",
  attack: "Jet d’attaque",
  bodyPart: "Organe",
  classSkill: "Compétence de classe",
  damage: "Dégâts",
  damageReduction: "Réduction des dégâts (RD)",
  droneWeapon: "Arme de drone",
  equipment: "Équipement",
  feat: "Don",
  featCount: "Nombre de Dons",
  hitPoints: "Points de vie",
  initiative: "Initiative",
  languageCount: "Nombre de langue",
  rank: "Rang de compétence",
  rankSkill: "Rang de compétence",
  resistance: "Résistance",
  resolve: "Points de persévérance",
  savingThrow: "Jets de sauvegarde",
  savingThrowBonus: "Jets de sauvegarde",
  size: "Taille",
  skill: "Compétence",
  skillTrained: "Compétence entraînée",
  speed: "Vitesse de déplacement",
  spell: "Sort",
  stamina: "Points d'endurance",
  weaponProficiency: "Maniement d’arme",
};

function retrieveSkillName(
  presenter: CharacterPresenter,
  data: IClientDataSet,
  target: string | undefined
): string | undefined {
  if (target === undefined) {
    return undefined;
  }

  if (target === "any") {
    return "Au choix";
  }

  if (target === "all") {
    return "Toutes";
  }

  if (target.startsWith("prof-")) {
    // Manage profession skills
    const profession = presenter.getAllProfessions().find((s) => s.id === target);
    if (!profession) {
      Sentry.captureMessage(`Profession ${target} not found`);
    }

    return profession ? profession.name : target;
  } else {
    // Manage generic skills
    const skill = data.skills.find((s) => s.id === target);
    if (!skill) {
      Sentry.captureMessage(`Skill ${target} not found`);
    }

    return skill ? skill.name : target;
  }
}

function adaptForFeat(
  presenter: CharacterPresenter,
  data: IClientDataSet,
  modifier: FeatModifier,
  element: ModifierComponentElement
): void {
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
        element.targetName = retrieveSkillName(presenter, data, modifier.target);
        break;
      case FeatTargetTypes.weapon:
        element.targetName = findOrError(data.weaponTypes, modifier.target).name;
        break;
      default:
        //Do nothing
        break;
    }
  }
}

function EquipmentModifierComponent({ modifier }: Readonly<{ modifier: EquipmentModifier }>) {
  const equipment = modifier.equipment;
  const weaponTypes = useAppSelector((state) => state.data.weaponTypes);
  if (equipment.type === "weaponMelee") {
    return (
      <p>
        <Badge bg="primary">{displayLabelsForType[modifier.type]}</Badge>
        <strong className="me-2">{equipment.name}.</strong>
        <br />
        <span className="me-2">{findOrError(weaponTypes, equipment.weaponType).name}</span>
        <br />
        {equipment.damage && (
          <span className="me-2">
            <DisplayDamageLong damage={equipment.damage} />
          </span>
        )}
        {equipment.specials && equipment.specials.length > 0 && (
          <span className="me-2">
            <DisplaySpecials specials={equipment.specials} />
          </span>
        )}
        <br />
        {equipment.description && <span className="me-2 text-muted">{equipment.description}</span>}
      </p>
    );
  } else {
    return (
      <p>
        <Badge bg="primary">{displayLabelsForType[modifier.type]}</Badge>
        <strong className="me-2">{equipment.name}.</strong>
        <br />
        {equipment.description && <span className="me-2 text-muted">{equipment.description}</span>}
      </p>
    );
  }
}

export default function ModifierComponent({ modifier }: Readonly<{ modifier: Modifier }>) {
  const presenter = useCharacterPresenter();
  const data = useAppSelector((state) => state.data);

  const element: ModifierComponentElement = {
    level: modifier.level && modifier.level > 1 ? modifier.level : undefined,
    name: hasName(modifier) ? modifier.name : undefined,
    description: hasDescription(modifier) ? modifier.description : undefined,
    category: hasCategory(modifier) ? findOrError(data.bonusCategories, modifier.category).name : undefined,
    value: hasValue(modifier) ? modifier.value : undefined,
    extra: hasExtra(modifier) ? modifier.extra : undefined,
  };

  switch (modifier.type) {
    case ModifierTypes.abilityScore:
      // Target is an ability score
      element.targetName = findOrError(data.abilityScores, modifier.target).name;
      break;

    case ModifierTypes.classSkill:
    case ModifierTypes.rankSkill:
    case ModifierTypes.skill:
    case ModifierTypes.skillTrained:
      // Target is a skill
      element.targetName = retrieveSkillName(presenter, data, modifier.target);
      break;

    case ModifierTypes.bodyPart:
      // Target is a body part
      element.targetName = findOrError(data.bodyParts, modifier.target).name;
      break;

    case ModifierTypes.equipment:
      return <EquipmentModifierComponent modifier={modifier} />;

    case ModifierTypes.feat: {
      adaptForFeat(presenter, data, modifier, element);
      break;
    }

    case ModifierTypes.resistance:
      // Target is a damage type
      element.targetName = findOrError(data.damageTypes, modifier.target).name;
      break;

    case ModifierTypes.speed:
      element.value = modifier.value * 1.5;
      break;

    case ModifierTypes.spell: {
      // Target is a spell
      const spell = data.spells.find((s) => s.id === modifier.target);
      element.targetName = spell?.name ?? modifier.target;
      break;
    }

    case ModifierTypes.weaponProficiency:
      // Target is a weapon type
      element.targetName = findOrError(data.weaponTypes, modifier.target).name;
      break;

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
      {element.category && <span className="me-2 text-muted">({element.category})</span>}
      <br />
      {element.description && <span className="me-2 text-muted">{element.description}</span>}
      {element.extra && <span className="me-2 text-muted">{element.extra}</span>}
    </p>
  );
}
