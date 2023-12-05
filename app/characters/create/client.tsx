"use client";

import { ChangeEvent, useState } from "react";
import { Button, Col, Form, InputGroup, Nav, Row, Stack } from "react-bootstrap";
import { AbilityScore } from "../../types";
import { Character, ClientComponentData, Context } from "./types";
import { TabIntro } from "./tab-intro";
import { TabRaceAlternateTraits, TabRaceSelection, TabRaceTraits } from "./tab-race";
import { TabThemeSelection, TabThemeTraits } from "./tab-theme";
import { TabClassDetails, TabClassSelection } from "./tab-class";

export function ClientComponent({ data }: { data: ClientComponentData }) {
  const [context, setContext] = useState<Context>({});
  const [navigation, setNavigation] = useState("intro");
  const [character, setCharacter] = useState<Character>(new Character());

  const selectedRace = data.races.find((r) => r.id === character.race) || null;
  const selectedVariant = selectedRace?.variants.find((v) => v.id === character.raceVariant) || null;
  const selectedTheme = data.themes.find((r) => r.id === character.theme) || null;
  const selectedClass = data.classes.find((c) => c.id === character.class) || null;

  const [alignment, setAlignment] = useState(data.alignments[0]);
  const [name, setName] = useState("");

  function getMinimalAbilityScoreFor(abilityScore: AbilityScore): number {
    let score = 10;

    if (selectedVariant) {
      score += selectedVariant.abilityScores[abilityScore.id] || 0;
    }

    if (selectedTheme) {
      score += selectedTheme.abilityScores[abilityScore.id] || 0;
    }

    if (
      character.raceVariant === "humans-standard" &&
      character.raceOptions !== undefined &&
      abilityScore.id === character.raceOptions.humanBonus
    ) {
      score += 2;
    }

    if (
      character.theme === "e1a9a6ad-0c95-4f31-a692-3327c77bb53f" &&
      character.themeOptions !== undefined &&
      abilityScore.id === character.themeOptions.noThemeAbility
    ) {
      score += 1;
    }

    return score;
  }

  function addToContext(name: string, value: string | number): void {
    setContext((c) => ({ ...c, [name]: value }));
  }

  function handleNavigation(eventKey: string | null): void {
    setNavigation(eventKey || "");
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>): void {
    setName(e.target.value);
  }

  function handleRandomizeName(): void {
    if (selectedRace === null) {
      console.error("Can't provide a name without a race selected - control should be disabled");
      return;
    }

    let index = Math.floor(Math.random() * selectedRace.names.length);
    setName(selectedRace.names[index]);
  }

  function handleAlignmentChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    let alignment = data.alignments.find((a) => a.id === id);
    if (alignment === undefined) {
      console.error("Can't find alignment with id", id);
    } else {
      setAlignment(alignment);
    }
  }

  function handleAbilityScoreClick(ablityScoreId: string, delta: number): void {
    setCharacter({
      ...character,
      abilityScores: { ...character.abilityScores, [ablityScoreId]: character.abilityScores[ablityScoreId] + delta },
    });
  }

  return (
    <Row>
      <Col lg={12} className="mb-3">
        <Nav variant="underline" activeKey={navigation} onSelect={handleNavigation}>
          <Nav.Item>
            <Nav.Link eventKey="intro">Introduction</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="race">Race</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="theme" disabled={selectedRace === null}>
              Thème
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="class" disabled={selectedTheme === null}>
              Classe
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="abilityScores"
              disabled={selectedRace === null || selectedTheme === null || selectedClass === null}
            >
              Caractéristiques & Compétences
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="equipment" disabled={selectedRace === null}>
              Équipement
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="spells" disabled={selectedRace === null}>
              Sorts
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="feats" disabled={selectedRace === null}>
              Don
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="debug">Debug</Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
      <Col lg={6} hidden={navigation !== "intro"}>
        <TabIntro />
      </Col>
      <Col lg={3} hidden={navigation !== "race"}>
        <TabRaceSelection data={data} character={character} setCharacter={setCharacter} />
      </Col>

      <Col hidden={navigation !== "race"}>
        <TabRaceTraits data={data} character={character} />
      </Col>

      <Col hidden={navigation !== "race"}>
        <TabRaceAlternateTraits data={data} character={character} setCharacter={setCharacter} />
      </Col>

      <Col lg={3} hidden={navigation !== "theme"}>
        <TabThemeSelection data={data} character={character} setCharacter={setCharacter} addToContext={addToContext} />
      </Col>

      <Col hidden={navigation !== "theme"}>
        <TabThemeTraits data={data} character={character} context={context} />
      </Col>

      <Col lg={3} hidden={navigation !== "class"}>
        <TabClassSelection data={data} character={character} setCharacter={setCharacter} />
      </Col>

      <Col hidden={navigation !== "class"}>
        <TabClassDetails data={data} character={character} context={context} />
      </Col>

      <Col lg={4} hidden={navigation !== "abilityScores"}>
        <Stack direction="vertical" gap={2}>
          <h2>Caractéristiques</h2>
          <Form.FloatingLabel controlId="abilityScoresMethod" label="Méthode de génération">
            <Form.Select>
              <option value="buy">Achat (méthode conseillée)</option>
              <option value="quick" disabled>
                Déterminaton rapide
              </option>
              <option value="random" disabled>
                Déterminaton aléatoire
              </option>
            </Form.Select>
          </Form.FloatingLabel>
          {data.abilityScores.map((abilityScore) => {
            let minimalScore = getMinimalAbilityScoreFor(abilityScore);
            let delta = minimalScore - 10;
            return (
              <Form.Group key={abilityScore.id} as={Row} controlId={abilityScore.id}>
                <Form.Label column>
                  {abilityScore.name}
                  {delta < 0 && <span className="badge ms-3 bg-secondary">{delta}</span>}
                  {delta > 0 && <span className="badge ms-3 bg-primary">+{delta}</span>}
                </Form.Label>
                <Col lg={4}>
                  <InputGroup>
                    <Button
                      variant="outline-secondary"
                      disabled={character.abilityScores[abilityScore.id] <= minimalScore}
                      onClick={() => handleAbilityScoreClick(abilityScore.id, -1)}
                    >
                      <i className="bi-dash-lg"></i>
                    </Button>
                    <Form.Control
                      type="number"
                      className="text-center"
                      value={character.abilityScores[abilityScore.id] || minimalScore}
                      onChange={() => {}}
                      min={minimalScore}
                      max={4}
                    />
                    <Button
                      variant="outline-secondary"
                      disabled={character.abilityScores[abilityScore.id] >= 18}
                      onClick={() => handleAbilityScoreClick(abilityScore.id, 1)}
                    >
                      <i className="bi-plus-lg"></i>
                    </Button>
                  </InputGroup>
                </Col>
                <Col lg={2}>
                  <div className="border rounded h-100 border-primary text-center">+2</div>
                </Col>
              </Form.Group>
            );
          })}
        </Stack>
      </Col>

      <Col lg={12} hidden={navigation !== "debug"}>
        <h5>Character</h5>
        <pre>{JSON.stringify(character, null, 2)}</pre>
        <h5>Context</h5>
        <pre>{JSON.stringify(context, null, 2)}</pre>
      </Col>
    </Row>
  );
}
