"use client";

import { useState } from "react";
import { Col, Nav, Row } from "react-bootstrap";
import { DataSet } from "data";
import { CharacterMutators, CharacterPresenter } from "logic";
import { Character } from "model";
import { TabIntro } from "./tab-intro";
import { TabRaceAlternateTraits, TabRaceSelection, TabRaceTraits } from "./tab-race";
import { TabThemeSelection, TabThemeTraits } from "./tab-theme";
import { TabClassDetails, TabClassSelection } from "./tab-class";
import { TabAbilityScoresSelection, TabSkillsSelection } from "./tab-abilityScores";

export function ClientComponent({ data }: { data: DataSet }) {
  const [presenter, setPresenter] = useState<CharacterPresenter>(() => new CharacterPresenter(data, new Character()));
  const [navigation, setNavigation] = useState("intro");

  function setCharacter(updator: (c: Character) => Character) {
    setPresenter((p) => new CharacterPresenter(data, updator(p.getCharacter())));
  }

  const mutators = new CharacterMutators(data, setCharacter);

  const selectedRace = presenter.getRace();
  const selectedTheme = presenter.getTheme();
  const selectedClass = presenter.getClass();

  function handleNavigation(eventKey: string | null): void {
    setNavigation(eventKey || "");
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
            <Nav.Link eventKey="equipment" disabled={selectedRace === null}>
              Équipement
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
        <TabRaceSelection data={data} character={presenter} mutators={mutators} />
      </Col>

      <Col hidden={navigation !== "race"}>
        <TabRaceTraits character={presenter} />
      </Col>

      <Col hidden={navigation !== "race"}>
        <TabRaceAlternateTraits character={presenter} mutators={mutators} />
      </Col>

      <Col lg={3} hidden={navigation !== "theme"}>
        <TabThemeSelection data={data} character={presenter} mutators={mutators} />
      </Col>

      <Col hidden={navigation !== "theme"}>
        <TabThemeTraits character={presenter} />
      </Col>

      <Col lg={3} hidden={navigation !== "class"}>
        <TabClassSelection data={data} character={presenter} mutators={mutators} />
      </Col>

      <Col hidden={navigation !== "class"}>
        <TabClassDetails character={presenter} />
      </Col>

      <Col lg={4} hidden={navigation !== "abilityScores"}>
        <TabAbilityScoresSelection data={data} character={presenter} mutators={mutators} />
      </Col>

      <Col lg={4} hidden={navigation !== "abilityScores"}>
        <TabSkillsSelection data={data} character={presenter} mutators={mutators} />
      </Col>

      <Col lg={12} hidden={navigation !== "debug"}>
        <h5>Character</h5>
        <pre>{JSON.stringify(presenter.getCharacter(), null, 2)}</pre>
      </Col>
    </Row>
  );
}
