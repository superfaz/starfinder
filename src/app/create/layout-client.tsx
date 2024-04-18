"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { Container, Row } from "react-bootstrap";
import { CookiesProvider, useCookies } from "react-cookie";
import { IClientDataSet } from "data";
import { CharacterPresenter, useAppSelector } from "logic";
import StoreProvider from "logic/StoreProvider";
import { Nav } from "app/components/Nav";
import { Character, IModel } from "model";

function AbilityScoreSubText({ presenter }: Readonly<{ presenter: CharacterPresenter }>) {
  const remainingAbilityScoresPoints = presenter.getRemainingAbilityScoresPoints();
  const ranks = Object.values(presenter.getCharacter().skillRanks).reduce((acc, v) => acc + v, 0);
  const remainingRanks = presenter.getRemainingSkillRanksPoints();

  if (remainingAbilityScoresPoints === 0 && remainingRanks === 0) {
    return (
      <span className="selected">
        <i className="bi bi-check"></i> Définies
      </span>
    );
  }

  if (remainingAbilityScoresPoints === 0 && remainingRanks !== 0) {
    return (
      <span className="selected">
        Rangs : {remainingRanks} / {ranks + remainingRanks}
      </span>
    );
  }

  if (remainingAbilityScoresPoints !== 10) {
    return <span className="selected">Charactérisques : {presenter.getRemainingAbilityScoresPoints()} / 10</span>;
  }

  return null;
}

export default function LayoutClient({
  data,
  debug,
  character,
  classesDetails,
  children,
}: Readonly<{
  data: IClientDataSet;
  debug: boolean;
  character?: Character;
  classesDetails?: Record<string, IModel>;
  children: ReactNode;
}>) {
  return (
    <StoreProvider data={data} character={character} classesDetails={classesDetails}>
      <CookiesProvider defaultSetOptions={{ path: "/", sameSite: "strict" }}>
        <LayoutClientPresenter debug={debug}>{children}</LayoutClientPresenter>
      </CookiesProvider>
    </StoreProvider>
  );
}

function LayoutClientPresenter({ debug, children }: Readonly<{ debug: boolean; children: ReactNode }>) {
  const data = useAppSelector((state) => state.data);
  const character = useAppSelector((state) => state.character);
  const classesDetails = useAppSelector((state) => state.classesDetails);
  const presenter = useMemo(
    () => new CharacterPresenter(data, classesDetails, character),
    [data, classesDetails, character]
  );

  const [, setCookie] = useCookies(["character"]);
  useEffect(() => {
    setCookie("character", JSON.stringify(character));
  }, [character, setCookie]);

  const selectedRace = presenter.getRace();
  const selectedTheme = presenter.getTheme();
  const selectedClass = presenter.getClass();

  return (
    <>
      <Nav className="mb-3 nav-create sticky-top" data-testid="tabs">
        <Nav.Item>
          <Nav.Link href="/create">Intro</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/create/race">
            <span className="label">Race</span>
            {selectedRace && <span className="selected">{selectedRace.name}</span>}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/create/theme" disabled={selectedRace === null}>
            <span className="label">Thème</span>
            {selectedTheme && <span className="selected">{selectedTheme.name}</span>}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/create/class" disabled={selectedTheme === null}>
            <span className="label">Classe</span>
            {selectedClass && <span className="selected">{selectedClass.name}</span>}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/create/profile" disabled={selectedClass === null}>
            <span className="label">Profil</span>
            {character.name && <span className="selected">{character.name}</span>}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/create/ability-scores" disabled={selectedClass === null}>
            <span className="label">Caractéristiques & Compétences</span>
            <AbilityScoreSubText presenter={presenter} />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/create/feats" disabled={selectedClass === null}>
            <span className="label">Don(s)</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/create/spells" disabled={selectedClass === null || !selectedClass.spellCaster}>
            <span className="label">Sorts</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/create/equipment" disabled={selectedClass === null}>
            <span className="label">Équipement</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/create/sheet">Fiche</Nav.Link>
        </Nav.Item>
        {debug && (
          <Nav.Item>
            <Nav.Link href="/create/debug">Debug</Nav.Link>
          </Nav.Item>
        )}
      </Nav>
      <Container className="mt-3" style={{ width: "1560px", minWidth: "1560px" }}>
        <Row id="content">{children}</Row>
      </Container>
    </>
  );
}
