import { useMemo, useState } from "react";
import { Button, Card, Col, FormControl, Row, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { IClientDataSet } from "data";
import { FeatTemplate, Prerequisite, PrerequisiteType, hasDescription } from "model";
import { CharacterPresenter, mutators, useAppDispatch, useAppSelector } from "logic";
import ModifierComponent from "../ModifierComponent";
import { CharacterProps } from "../Props";

type FeatTemplateExtended = FeatTemplate & { available: boolean };

// eslint-disable-next-line sonarjs/cognitive-complexity
function getPrerequisiteText(data: IClientDataSet, prerequisite: Prerequisite) {
  switch (prerequisite.type) {
    case PrerequisiteType.enum.abilityScore: {
      const target = prerequisite.target === "<primary>" ? "dex" : prerequisite.target;
      const abilityScore = findOrError(data.abilityScores, (e) => e.id === target).name;
      return `${abilityScore} ${prerequisite.value}`;
    }

    case PrerequisiteType.enum.arms:
      return `${prerequisite.value} bras`;

    case PrerequisiteType.enum.baseAttack:
      return `Bonus de base à l'attaque +${prerequisite.value}`;

    case PrerequisiteType.enum.class: {
      if (prerequisite.target.startsWith("!")) {
        const target = prerequisite.target.substring(1);
        const name = data.classes.find((e) => e.id === target)?.name ?? target;
        return `Pas de niveau de ${name}`;
      } else {
        const name = data.classes.find((e) => e.id === prerequisite.target)?.name ?? prerequisite.target;
        return `${name} de niveau 1`;
      }
    }

    case PrerequisiteType.enum.combatFeatCount:
      return `${prerequisite.value} dons de combat`;

    case PrerequisiteType.enum.feat:
      return `Don ${prerequisite.target}`;

    case PrerequisiteType.enum.level:
      return `Niveau ${prerequisite.value}`;

    case PrerequisiteType.enum.savingThrow:
      return `Jet de sauvegarde ${prerequisite.target} +${prerequisite.value}`;

    case PrerequisiteType.enum.skillRank: {
      const name = data.skills.find((e) => e.id === prerequisite.target)?.name ?? prerequisite.target;
      if (prerequisite.value === 1) {
        return `1 rang de compétence en ${name}`;
      } else {
        return `${prerequisite.value} rang(s) de compétence en ${name}`;
      }
    }

    case PrerequisiteType.enum.spellCasterLevel:
      if (prerequisite.value === 0) {
        return "Aucun niveau de lanceur de sorts";
      } else {
        return `Niveau de lanceur de sorts ${prerequisite.value}`;
      }

    case PrerequisiteType.enum.weaponProficiency: {
      const name = data.weapons.find((e) => e.id === prerequisite.target)?.name ?? prerequisite.target;
      return `Maîtrise des ${name}`;
    }

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
  const text = getPrerequisiteText(data, prerequisite);
  const valid = character.checkPrerequisite(prerequisite);
  return <li className={valid ? undefined : "text-danger"}>{text}</li>;
}

function FeatComponent({
  mode,
  character,
  feat,
}: {
  mode: "add" | "remove";
  character: CharacterPresenter;
  feat: FeatTemplateExtended;
}) {
  const dispatch = useAppDispatch();
  const templater = character.createTemplater();

  function handleAddFeat() {
    dispatch(mutators.addFeat(feat.id));
  }

  function handleRemoveFeat() {
    dispatch(mutators.removeFeat(feat.id));
  }

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col className={!feat.available ? "text-danger" : undefined}>
            {feat.name}
            {feat.combatFeat ? " (combat)" : ""}
          </Col>
          <Col xs="auto">
            {mode === "add" && (
              <Button
                variant={!feat.available ? "outline-danger" : undefined}
                disabled={!feat.available}
                size="sm"
                onClick={handleAddFeat}
              >
                Ajouter
              </Button>
            )}
            {mode === "remove" && (
              <Button size="sm" onClick={handleRemoveFeat}>
                Enlever
              </Button>
            )}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {feat.description && <p className="text-muted">{feat.description}</p>}
        {feat.modifiers.map((modifier) => (
          <ModifierComponent key={modifier.id} modifier={templater.convertModifier(modifier)} />
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
  );
}

export function FeatSelected({ character }: CharacterProps) {
  const feats = character.getSelectedFeats().map((f) => ({ ...f, available: character.checkPrerequisites(f) }));
  if (feats.length === 0) {
    return null;
  } else {
    return (
      <>
        <h2>Dons sélectionnés</h2>
        <Row>
          {feats.map((feat) => (
            <Col xs="4" key={feat.id} className="mb-4">
              <FeatComponent mode="remove" key={feat.id} character={character} feat={feat} />
            </Col>
          ))}
        </Row>
      </>
    );
  }
}

export function FeatSelection({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  const allFeats = useMemo(
    () =>
      data.feats
        .map((f) => ({ ...f, available: character.checkPrerequisites(f) }))
        .filter((f) => !character.hasFeat(f))
        .filter((f) => !f.hidden && f.type === "simple"),
    [data.feats, character]
  );

  const [category, setCategory] = useState<"general" | "combat" | "all">("all");
  const [prerequisite, setPrerequisite] = useState<"available" | "blocked" | "all">("available");
  const [search, setSearch] = useState<string>("");

  let categoryFilter: (feat: FeatTemplate) => boolean;
  if (category === "combat") {
    categoryFilter = (feat) => feat.combatFeat;
  } else if (category === "general") {
    categoryFilter = (feat) => !feat.combatFeat;
  } else {
    categoryFilter = () => true;
  }

  let prerequisiteFilter: (feat: FeatTemplateExtended) => boolean;
  if (prerequisite === "available") {
    prerequisiteFilter = (feat) => feat.available;
  } else if (prerequisite === "blocked") {
    prerequisiteFilter = (feat) => !feat.available;
  } else {
    prerequisiteFilter = () => true;
  }

  let searchFilter: (feat: FeatTemplate) => boolean;
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

  const displayedFeats = allFeats.filter(categoryFilter).filter(prerequisiteFilter).filter(searchFilter);

  return (
    <>
      <h2>Dons disponibles</h2>
      <Row className="mb-3 align-items-center">
        <Col xs="auto" className="ms-3">
          Filtres:
        </Col>
        <Col xs="auto">
          <ToggleButtonGroup type="radio" name="type" value={category} onChange={setCategory}>
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
          <Col xs="4" key={feat.id} className="mb-4">
            <FeatComponent mode="add" character={character} feat={feat} />
          </Col>
        ))}
      </Row>
    </>
  );
}
