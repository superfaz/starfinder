"use client";

import { useState } from "react";
import { Col, Nav, Row } from "react-bootstrap";
import { DataSet } from "data";
import { CharacterMutators, CharacterPresenter } from "logic";
import { Character } from "model";
import * as Tab from "./tabs";

export function ClientComponent({ data }: Readonly<{ data: DataSet }>) {
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
    setNavigation(eventKey ?? "");
  }

  return (
    <>
      <Nav variant="underline" className="mb-3" activeKey={navigation} onSelect={handleNavigation}>
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
          <Nav.Link eventKey="profile" disabled={selectedClass === null}>
            Profil
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="abilityScores" disabled={selectedClass === null}>
            Caractéristiques & Compétences
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="feats" disabled={selectedClass === null}>
            Don
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="equipment" disabled={selectedClass === null}>
            Équipement
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="sheet">Fiche</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="debug">Debug</Nav.Link>
        </Nav.Item>
      </Nav>
      <Row id="content">
        <Col lg={6} hidden={navigation !== "intro"}>
          <Tab.Intro />
        </Col>
        <Col lg={3} hidden={navigation !== "race"}>
          <Tab.RaceSelection data={data} character={presenter} mutators={mutators} />
        </Col>

        <Col hidden={navigation !== "race"}>
          <Tab.RaceTraits character={presenter} />
        </Col>

        <Col hidden={navigation !== "race"}>
          <Tab.RaceAlternateTraits character={presenter} mutators={mutators} />
        </Col>

        <Col lg={3} hidden={navigation !== "theme"}>
          <Tab.ThemeSelection data={data} character={presenter} mutators={mutators} />
        </Col>

        <Col hidden={navigation !== "theme"}>
          <Tab.ThemeTraits character={presenter} />
        </Col>

        <Col lg={3} hidden={navigation !== "class"}>
          <Tab.ClassSelection data={data} character={presenter} mutators={mutators} />
        </Col>

        <Col hidden={navigation !== "class"}>
          <Tab.ClassDetails character={presenter} />
        </Col>

        <Col lg={3} hidden={navigation !== "profile"}>
          <Tab.Profile data={data} character={presenter} mutators={mutators} />
        </Col>

        <Col lg={3} hidden={navigation !== "profile"}>
          <Tab.Avatar data={data} character={presenter} mutators={mutators} />
        </Col>

        <Col lg={4} hidden={navigation !== "abilityScores"}>
          <Tab.AbilityScores data={data} character={presenter} mutators={mutators} />
        </Col>

        <Col lg={4} hidden={navigation !== "abilityScores"}>
          <Tab.Skills data={data} character={presenter} mutators={mutators} />
        </Col>

        <Col lg={12} hidden={navigation !== "sheet"}>
          <Tab.Sheet data={data} character={presenter} />
        </Col>

        <Col lg={12} hidden={navigation !== "debug"}>
          <h5>Character</h5>
          <pre>{JSON.stringify(presenter.getCharacter(), null, 2)}</pre>
        </Col>
      </Row>
    </>
  );
}
