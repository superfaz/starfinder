"use client";

import { useState } from "react";
import { Col, Nav, Row } from "react-bootstrap";
import { Character, DataSet, Context } from "./types";
import { TabIntro } from "./tab-intro";
import { TabRaceAlternateTraits, TabRaceSelection, TabRaceTraits } from "./tab-race";
import { TabThemeSelection, TabThemeTraits } from "./tab-theme";
import { TabClassDetails, TabClassSelection } from "./tab-class";
import { TabAbilityScoresSelection, TabSkillsSelection } from "./tab-abilityScores";

export function ClientComponent({ data }: { data: DataSet }) {
  const [context, setContext] = useState<Context>({});
  const [navigation, setNavigation] = useState("intro");
  const [character, setCharacter] = useState<Character>(new Character());

  const selectedRace = data.races.find((r) => r.id === character.race) || null;
  const selectedTheme = data.themes.find((r) => r.id === character.theme) || null;
  const selectedClass = data.classes.find((c) => c.id === character.class) || null;

  function addToContext(name: string, value: string | number): void {
    setContext((c) => ({ ...c, [name]: value }));
  }

  function handleNavigation(eventKey: string | null): void {
    setNavigation(eventKey || "");
  }

  // This is a hack to make the character sheet fill the screen
  window.document.getElementsByTagName("html")[0].className = "fullscreen";

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
        <TabAbilityScoresSelection data={data} character={character} setCharacter={setCharacter} />
      </Col>

      <Col lg={4} hidden={navigation !== "abilityScores"}>
        <TabSkillsSelection data={data} character={character} setCharacter={setCharacter} />
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
