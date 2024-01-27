import { Card, Col, FormControl, Row, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { Feat, Prerequisite, PrerequisiteType, hasDescription } from "model";
import { CharacterPresenter, useAppSelector } from "logic";
import ModifierComponent from "../ModifierComponent";
import { CharacterProps } from "../Props";
import { IClientDataSet } from "data";
import { useState } from "react";

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
  const [type, setType] = useState<"general" | "combat" | "all">("all");
  const [prerequisite, setPrerequisite] = useState<"available" | "blocked" | "all">("available");
  const [search, setSearch] = useState<string>("");

  let typeFilter: (feat: Feat) => boolean;
  if (type === "combat") {
    typeFilter = (feat) => feat.combatFeat;
  } else if (type === "general") {
    typeFilter = (feat) => !feat.combatFeat;
  } else {
    typeFilter = () => true;
  }

  let prerequisiteFilter: (feat: Feat) => boolean;
  if (prerequisite === "available") {
    prerequisiteFilter = (feat) => feat.available;
  } else if (prerequisite === "blocked") {
    prerequisiteFilter = (feat) => !feat.available;
  } else {
    prerequisiteFilter = () => true;
  }

  let searchFilter: (feat: Feat) => boolean;
  if (search.trim() === "") {
    searchFilter = () => true;
  } else {
    const searchLower = search.trim().toLowerCase();
    searchFilter = (feat) =>
      feat.name.toLowerCase().includes(searchLower) ||
      feat.description?.toLowerCase().includes(searchLower) ||
      feat.modifiers.some(
        (modifier) => hasDescription(modifier) && modifier.description.toLowerCase().includes(searchLower)
      );
  }

  const displayedFeats = character.getAllFeats().filter(typeFilter).filter(prerequisiteFilter).filter(searchFilter);

  return (
    <>
      <h2>Dons disponibles</h2>
      <Row className="mb-3 align-items-center">
        <Col xs="auto" className="ms-3">
          Filtres:
        </Col>
        <Col xs="auto">
          <ToggleButtonGroup type="radio" name="type" value={type} onChange={setType}>
            <ToggleButton id="type-general" value="general" variant="outline-secondary">
              Dons généraux
            </ToggleButton>
            <ToggleButton id="type-all" value="all" variant="outline-secondary">
              Tous
            </ToggleButton>
            <ToggleButton id="type-combat" value="combat" variant="outline-secondary">
              Dons de combat
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
        <Col xs="auto">
          <ToggleButtonGroup type="radio" name="prerequisite" value={prerequisite} onChange={setPrerequisite}>
            <ToggleButton id="prerequisite-available" value="available" variant="outline-secondary">
              Disponibles
            </ToggleButton>
            <ToggleButton id="prerequisite-all" value="all" variant="outline-secondary">
              Tous
            </ToggleButton>
            <ToggleButton id="prerequisite-blocked" value="blocked" variant="outline-secondary">
              Conditions non remplies
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
        <Col>
          <FormControl
            type="search"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        {displayedFeats.map((feat) => (
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
