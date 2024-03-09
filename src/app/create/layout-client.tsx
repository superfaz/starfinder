"use client";

import { ReactNode, useMemo, useState } from "react";
import { Container, Nav, NavLink, Navbar } from "react-bootstrap";
import { CookiesProvider } from "react-cookie";
import { IClientDataSet } from "data";
import { CharacterPresenter, mutators, useAppDispatch, useAppSelector } from "logic";
import StoreProvider from "logic/StoreProvider";

export default function LayoutClient({ data, children }: Readonly<{ data: IClientDataSet; children: ReactNode }>) {
  return (
    <StoreProvider data={data}>
      <CookiesProvider defaultSetOptions={{ path: "/", sameSite: "strict" }}>
        <LayoutClientPresenter>{children}</LayoutClientPresenter>
      </CookiesProvider>
    </StoreProvider>
  );
}

function LayoutClientPresenter({ children }: Readonly<{ children: ReactNode }>) {
  const debug = process.env.STARFINDER_DEBUG === "true";

  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.data);
  const navigation = useAppSelector((state) => state.navigation);
  const character = useAppSelector((state) => state.character);
  const classesDetails = useAppSelector((state) => state.classesDetails);
  const presenter = useMemo(
    () => new CharacterPresenter(data, classesDetails, character),
    [data, classesDetails, character]
  );

  const selectedRace = presenter.getRace();
  const selectedTheme = presenter.getTheme();
  const selectedClass = presenter.getClass();

  function handleNavigation(eventKey: string | null): void {
    dispatch(mutators.updateNavigation(eventKey ?? ""));
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
          <Nav.Item>
            <Nav.Link eventKey="debug">Debug</Nav.Link>
          </Nav.Item>
        </Nav>
        {children}
      </Container>
    </>
  );
}
