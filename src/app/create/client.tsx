"use client";

import { useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavLink from "react-bootstrap/NavLink";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { IClientDataSet } from "data";
import { CharacterPresenter, useAppSelector } from "logic";
import StoreProvider from "../../logic/StoreProvider";
import * as Tab from "./tabs";

function ClientComponentPresenter({ debug }: { debug: boolean }) {
  const data = useAppSelector((state) => state.data);
  const character = useAppSelector((state) => state.character);
  const classesDetails = useAppSelector((state) => state.classesDetails);
  const presenter = useMemo(
    () => new CharacterPresenter(data, classesDetails, character),
    [data, classesDetails, character]
  );

  const [navigation, setNavigation] = useState("intro");

  const selectedRace = presenter.getRace();
  const selectedTheme = presenter.getTheme();
  const selectedClass = presenter.getClass();

  function handleNavigation(eventKey: string | null): void {
    setNavigation(eventKey ?? "");
  }

  return (
    <>
      <Navbar className="sticky-top" bg="body-secondary">
        <Container fluid>
          <Navbar.Brand>monperso StarFinder</Navbar.Brand>
          <Nav className="me-auto">
            <NavLink href="/">Home</NavLink>
          </Nav>
          <Navbar.Text className="header active" role="heading" aria-level={1}>
            Création de personnage
          </Navbar.Text>
          <Nav className="ms-auto">
            <NavLink href="https://github.com/superfaz/starfinder">
              <i className="bi bi-github" aria-label="github" title="github"></i>
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-3" style={{ width: "1600px", minWidth: "1600px" }}>
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
              Don(s)
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="spells" disabled={selectedClass === null || !selectedClass.spellCaster}>
              Sorts
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
          {debug && (
            <Nav.Item>
              <Nav.Link eventKey="debug">Debug</Nav.Link>
            </Nav.Item>
          )}
        </Nav>
        <Row id="content">
          {navigation === "intro" && (
            <Col lg={6}>
              <Tab.Intro />
            </Col>
          )}

          {navigation === "race" && (
            <>
              <Col lg={3}>
                <Tab.RaceSelection character={presenter} />
              </Col>
              <Col>
                <Tab.RaceTraits character={presenter} />
              </Col>
              <Col>
                <Tab.RaceAlternateTraits character={presenter} />
              </Col>
            </>
          )}

          {navigation === "theme" && (
            <>
              <Col lg={3}>
                <Tab.ThemeSelection character={presenter} />
              </Col>
              <Col>
                <Tab.ThemeTraits character={presenter} />
              </Col>
            </>
          )}

          {navigation === "class" && (
            <>
              <Col lg={3}>
                <Tab.ClassSelection character={presenter} />
              </Col>
              <Col>
                <Tab.ClassDetails character={presenter} />
              </Col>
            </>
          )}

          {navigation === "profile" && (
            <>
              <Col lg={3}>
                <Tab.Profile character={presenter} />
              </Col>
              <Col lg={3}>
                <Tab.Avatar character={presenter} />
              </Col>
              <Col lg={6}>
                <Tab.Description character={presenter} />
              </Col>
            </>
          )}
          {navigation === "abilityScores" && (
            <>
              <Col lg={4}>
                <Stack direction="vertical" gap={4}>
                  <Tab.AbilityScores character={presenter} />
                  <Tab.ProfessionSkills />
                </Stack>
              </Col>
              <Col lg={4}>
                <Tab.Skills character={presenter} />
              </Col>
              <Col lg={4}>
                <Tab.SkillsModifiers character={presenter} />
              </Col>
            </>
          )}

          {navigation === "feats" && (
            <>
              <Col lg={12}>
                <Tab.FeatsInherited character={presenter} />
              </Col>
              <Col lg={12}>
                <Tab.FeatsSelected character={presenter} />
              </Col>
              <Col lg={12}>
                <Tab.FeatsSelection character={presenter} />
              </Col>
            </>
          )}

          {navigation === "spells" && (
            <Col lg={12}>
              <Tab.SpellsSelection character={presenter} />
            </Col>
          )}

          {navigation === "sheet" && (
            <Col lg={12}>
              <Tab.Sheet character={presenter} />
            </Col>
          )}

          {debug && navigation === "debug" && (
            <Col lg={12}>
              <h5>Character</h5>
              <pre>{JSON.stringify(character, null, 2)}</pre>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

export function ClientComponent({ data, debug }: Readonly<{ data: IClientDataSet; debug: boolean }>) {
  return (
    <StoreProvider data={data}>
      <ClientComponentPresenter debug={debug} />
    </StoreProvider>
  );
}
