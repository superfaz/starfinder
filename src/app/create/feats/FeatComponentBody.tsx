import { findOrError } from "app/helpers";
import { IClientDataSet } from "data";
import { CharacterPresenter, useAppSelector } from "logic";
import { Prerequisite, PrerequisiteTypes } from "model";
import { Feat } from "view";
import ModifierComponent from "../ModifierComponent";
import { Card } from "react-bootstrap";

// eslint-disable-next-line sonarjs/cognitive-complexity
function getPrerequisiteText(data: IClientDataSet, prerequisite: Prerequisite) {
  switch (prerequisite.type) {
    case PrerequisiteTypes.abilityScore: {
      const target = prerequisite.target === "<primary>" ? "dex" : prerequisite.target;
      const abilityScore = findOrError(data.abilityScores, target).name;
      return `${abilityScore} ${prerequisite.value}`;
    }

    case PrerequisiteTypes.armorProficiency: {
      const name = data.armorTypes.find((e) => e.id === prerequisite.target)?.name ?? prerequisite.target;
      return `Formé au Ports des ${name}`;
    }

    case PrerequisiteTypes.arms:
      return `${prerequisite.value} bras`;

    case PrerequisiteTypes.baseAttack:
      return `Bonus de base à l'attaque +${prerequisite.value}`;

    case PrerequisiteTypes.class: {
      if (prerequisite.target.startsWith("!")) {
        const target = prerequisite.target.substring(1);
        const name = data.classes.find((e) => e.id === target)?.name ?? target;
        return `Pas de niveau de ${name}`;
      } else {
        const name = data.classes.find((e) => e.id === prerequisite.target)?.name ?? prerequisite.target;
        return `${name} de niveau 1`;
      }
    }

    case PrerequisiteTypes.combatFeatCount:
      return `${prerequisite.value} dons de combat`;

    case PrerequisiteTypes.feat: {
      if (prerequisite.target === "*weapon-specialization") {
        return "Un don de type Spécialisation martiale";
      } else if (prerequisite.target.startsWith("!")) {
        const feat = findOrError(data.feats, (e) => e.id === prerequisite.target.substring(1));
        return `Ne pas avoir le don ${feat.name}`;
      } else {
        const feat = data.feats.find((e) => e.id === prerequisite.target)?.name ?? prerequisite.target;
        return `Don ${feat}`;
      }
    }

    case PrerequisiteTypes.level:
      return `Niveau ${prerequisite.value}`;

    case PrerequisiteTypes.notSpellCaster:
      return "Incapacité à lancer des sorts ou à utiliser des pouvoirs magiques";

    case PrerequisiteTypes.savingThrow:
      return `Jet de sauvegarde ${prerequisite.target} +${prerequisite.value}`;

    case PrerequisiteTypes.skillRank: {
      const name = data.skills.find((e) => e.id === prerequisite.target)?.name ?? prerequisite.target;
      if (prerequisite.value === 1) {
        return `1 rang de compétence en ${name}`;
      } else {
        return `${prerequisite.value} rang(s) de compétence en ${name}`;
      }
    }

    case PrerequisiteTypes.spellCaster:
      return "Aptitude d’incantation de sorts";

    case PrerequisiteTypes.spellCasterLevel:
      return `Aptitude à lancer des sorts de niveau ${prerequisite.value}`;

    case PrerequisiteTypes.weaponProficiency: {
      const name = data.weaponTypes.find((e) => e.id === prerequisite.target)?.name ?? prerequisite.target;
      return `Formé au Maniement des ${name}`;
    }

    default:
      return "Prérequis inconnu";
  }
}

function PrerequisiteComponent({
  character,
  prerequisite,
}: Readonly<{
  character: CharacterPresenter;
  prerequisite: Prerequisite;
}>) {
  const data = useAppSelector((state) => state.data);
  const text = getPrerequisiteText(data, prerequisite);
  const valid = character.checkPrerequisite(prerequisite);
  return <li className={valid ? undefined : "text-danger"}>{text}</li>;
}

export function FeatComponentBody({ character, feat }: Readonly<{ character: CharacterPresenter; feat: Feat }>) {
  return (
    <Card.Body>
      {feat.description && <p className="text-muted">{feat.description}</p>}
      {feat.modifiers.map((modifier) => (
        <ModifierComponent key={modifier.id} modifier={modifier} />
      ))}
      {feat.prerequisites.length > 0 && (
        <>
          <hr />
          <h6>Conditions</h6>
          <ul>
            {feat.prerequisites.map((prerequisite) => (
              <PrerequisiteComponent key={prerequisite.id} character={character} prerequisite={prerequisite} />
            ))}
          </ul>
        </>
      )}
    </Card.Body>
  );
}
