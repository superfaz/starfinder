import { Card, Row } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { Prerequisite, PrerequisiteType } from "model";
import { CharacterPresenter, useAppSelector } from "logic";
import ModifierComponent from "../ModifierComponent";
import { CharacterProps } from "../Props";
import { IClientDataSet } from "data";

function getText(data: IClientDataSet, prerequisite: Prerequisite) {
  switch (prerequisite.type) {
    case PrerequisiteType.enum.abilityScore: {
      const target = prerequisite.target === "<primary>" ? "dex" : prerequisite.target;
      const abilityScore = findOrError(data.abilityScores, (e) => e.id === target).name;
      return `${abilityScore} >= ${prerequisite.value}`;
    }

    case PrerequisiteType.enum.arms:
      return `${prerequisite.value} bras`;

    case PrerequisiteType.enum.baseAttack:
      return `Bonus de base à l'attaque >= ${prerequisite.value}`;

    case PrerequisiteType.enum.class:
      return `Classe ${prerequisite.target}`;

    case PrerequisiteType.enum.combatFeatCount:
      return `${prerequisite.value} dons de combat`;

    case PrerequisiteType.enum.feat:
      return `Don '${prerequisite.target}'`;

    case PrerequisiteType.enum.level:
      return `Niveau ${prerequisite.value}`;

    case PrerequisiteType.enum.savingThrow:
      return `Jet de sauvegarde ${prerequisite.target} >= ${prerequisite.value}`;

    case PrerequisiteType.enum.skillRank:
      return `${prerequisite.value} rang(s) de compétence en '${prerequisite.target}'`;

    case PrerequisiteType.enum.spellCasterLevel:
      return `Niveau de lanceur de sorts >= ${prerequisite.value}`;

    case PrerequisiteType.enum.weaponProficiency:
      return `Maîtrise des armes '${prerequisite.target}'`;

    default:
      return "Prérequis inconnu";
  }
}

function PrerequisiteComponent({
  character,
  prerequisite,
}: {
  character: CharacterPresenter;
  prerequisite: Prerequisite;
}) {
  const data = useAppSelector((state) => state.data);
  const text = getText(data, prerequisite);
  const valid = character.checkPrerequisite(prerequisite);
  return <li className={valid ? undefined : "text-danger"}>{text}</li>;
}

export function Feats({ character }: CharacterProps) {
  return (
    <>
      <h2>Dons disponibles</h2>
      <Row>
        {character.getAllFeats().map((feat) => (
          <div key={feat.id} className="col-4 mb-4">
            <Card key={feat.id}>
              <Card.Header className={feat.available ? undefined : "text-danger"}>
                {feat.name}
                {feat.combatFeat ? " (combat)" : ""}
              </Card.Header>
              <Card.Body>
                {feat.description && <p className="text-muted">{feat.description}</p>}
                {feat.modifiers.map((modifier) => (
                  <ModifierComponent key={modifier.id} modifier={modifier} />
                ))}
                {feat.prerequisites !== undefined && (
                  <>
                    <hr />
                    <h6>Conditions</h6>
                    {feat.prerequisites.map((prerequisite) => (
                      <PrerequisiteComponent key={prerequisite.id} character={character} prerequisite={prerequisite} />
                    ))}
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </Row>
    </>
  );
}
