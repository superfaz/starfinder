import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { findOrError } from "app/helpers";
import { IClientDataSet } from "data";
import type { FeatTemplate, Prerequisite } from "model";
import { PrerequisiteTypes, hasDescription } from "model";
import {
  CharacterPresenter,
  FeatPresenter,
  FeatTemplateExtended,
  mutators,
  useAppDispatch,
  useAppSelector,
} from "logic";
import { Feat } from "view";
import ModifierComponent from "../ModifierComponent";
import { CharacterProps } from "../Props";
import { Stack } from "react-bootstrap";

// eslint-disable-next-line sonarjs/cognitive-complexity
function getPrerequisiteText(data: IClientDataSet, prerequisite: Prerequisite) {
  switch (prerequisite.type) {
    case PrerequisiteTypes.abilityScore: {
      const target = prerequisite.target === "<primary>" ? "dex" : prerequisite.target;
      const abilityScore = findOrError(data.abilityScores, target).name;
      return `${abilityScore} ${prerequisite.value}`;
    }

    case PrerequisiteTypes.armorProficiency: {
      const name = data.armors.find((e) => e.id === prerequisite.target)?.name ?? prerequisite.target;
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
      const name = data.weapons.find((e) => e.id === prerequisite.target)?.name ?? prerequisite.target;
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

function FeatComponentBody({ character, feat }: Readonly<{ character: CharacterPresenter; feat: Feat }>) {
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

function FeatComponent({
  character,
  feat,
  noAction = false,
}: Readonly<{ character: CharacterPresenter; feat: Feat; noAction?: boolean }>) {
  const dispatch = useAppDispatch();

  function handleRemoveFeat() {
    dispatch(mutators.removeFeat({ id: feat.id, target: feat.target }));
  }

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            {feat.name}
            {feat.combatFeat ? " (combat)" : ""}
          </Col>
          {!noAction && (
            <Col xs="auto">
              <Button size="sm" onClick={handleRemoveFeat}>
                Enlever
              </Button>
            </Col>
          )}
        </Row>
      </Card.Header>
      <FeatComponentBody character={character} feat={feat} />
    </Card>
  );
}

function FeatTemplateComponent({
  character,
  template,
}: Readonly<{
  character: CharacterPresenter;
  template: FeatTemplateExtended;
}>) {
  const dispatch = useAppDispatch();
  const templater = character.createTemplater();
  const featsCount = character.getSelectableFeatCount();

  const availableOptions = template.options?.filter((o) => o.available);
  const unavailableOptions = template.options?.filter((o) => !o.available);
  const [selectedOptionId, setSelectedOptionId] = useState(availableOptions[0]?.id || unavailableOptions[0]?.id);
  const selectedOption = template.options?.find((o) => o.id === selectedOptionId);
  const feat = templater.convertFeat(template, selectedOption);

  function handleAddFeat(target?: string) {
    dispatch(mutators.addFeat({ id: template.id, target }));
  }

  return (
    <Card data-testid={feat.id}>
      <Card.Header role="heading">
        <Row className="align-items-center">
          <Col className={!template.available ? "text-danger" : undefined}>
            {feat.name}
            {feat.combatFeat ? " (combat)" : ""}
          </Col>
          {template.type === "simple" && (
            <Col xs="auto">
              <Button
                variant={!template.available ? "outline-danger" : undefined}
                disabled={!template.available || featsCount <= 0}
                size="sm"
                onClick={() => handleAddFeat()}
              >
                Ajouter
              </Button>
            </Col>
          )}
        </Row>
      </Card.Header>
      {(template.type === "targeted" || template.type === "multiple") && (
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <Form.Select value={selectedOptionId} onChange={(e) => setSelectedOptionId(e.target.value)}>
                {availableOptions && (
                  <optgroup label="Disponibles">
                    {availableOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {unavailableOptions && (
                  <optgroup label="Non disponible" className="text-danger">
                    {unavailableOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </Form.Select>
            </Col>
            <Col xs="auto">
              <Button
                variant={!selectedOption?.available ? "outline-danger" : undefined}
                disabled={!selectedOption?.available || featsCount <= 0}
                size="sm"
                onClick={() => handleAddFeat(selectedOptionId)}
              >
                Ajouter
              </Button>
            </Col>
          </Row>
        </Card.Body>
      )}
      <FeatComponentBody character={character} feat={feat} />
    </Card>
  );
}

export function FeatsInherited({ character }: CharacterProps) {
  const feats = character.getInheritedFeats();
  if (feats.length === 0) {
    return null;
  } else {
    return (
      <>
        <h2>Don(s) acqui(s)</h2>
        <Stack direction="vertical" gap={2} className="mb-4" data-testid="feats-inherited">
          {feats.map((feat) => (
            <div key={`${feat.id}-${feat.target}`}>
              <FeatComponent character={character} feat={feat} noAction />
            </div>
          ))}
        </Stack>
      </>
    );
  }
}

export function FeatsSelected({ character }: CharacterProps) {
  const feats = character.getSelectedFeats();
  const featCount = character.getSelectableFeatCount();

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Don(s) sélectionné(s)</h2>
      <div className="text-muted mb-3">
        <span className="rounded border bg-body-secondary py-2 px-3">{featCount}</span> à choisir
      </div>
      <Stack direction="vertical" gap={2} className="mb-4" data-testid="feats-selected">
        {feats.map((feat) => (
          <div key={feat.id}>
            <FeatComponent character={character} feat={feat} />
          </div>
        ))}
      </Stack>
    </Stack>
  );
}

export function FeatsSelection({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  const presenter = new FeatPresenter(data, character);
  const allFeats = presenter.getFeatTemplates();

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

  const displayedFeats = allFeats
    .filter((f) => f.visible)
    .filter(categoryFilter)
    .filter(prerequisiteFilter)
    .filter(searchFilter);

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

      <Row data-testid="feats">
        {displayedFeats.map((template) => (
          <Col xs="4" key={template.id} className="mb-4">
            <FeatTemplateComponent character={character} template={template} />
          </Col>
        ))}
      </Row>
    </>
  );
}
