"use client";

import { clsx } from "clsx";
import { ReactNode, useEffect, useMemo } from "react";
import { Container, Navbar, Row } from "react-bootstrap";
import { CookiesProvider, useCookies } from "react-cookie";
import Link from "next/link";
import { IClientDataSet } from "data";
import { CharacterPresenter, useAppSelector } from "logic";
import StoreProvider from "logic/StoreProvider";
import { usePathname } from "next/navigation";
import { Nav } from "app/components/Nav";
import { Character, IModel } from "model";

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
  const pathname = usePathname();
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

  function NavLink({ children, href, disabled }: { children: ReactNode; href: string; disabled?: boolean }) {
    return (
      <Link href={href} className={clsx("nav-link", pathname === href && "active", disabled && "disabled")}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <Navbar className="sticky-top" bg="body-secondary">
        <Container fluid>
          <Navbar.Brand>monperso StarFinder</Navbar.Brand>
          <Nav className="navbar-nav me-auto">
            <Link className="nav-link" href="/">
              Home
            </Link>
          </Nav>
          <Navbar.Text className="header active" role="heading" aria-level={1}>
            Création de personnage
          </Navbar.Text>
          <Nav className="navbar-nav ms-auto">
            <a className="nav-link" href="https://github.com/superfaz/starfinder">
              <i className="bi bi-github" aria-label="github" title="github"></i>
            </a>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-3" style={{ width: "1600px", minWidth: "1600px" }}>
        <Nav variant="underline" className="mb-3" data-testid="tabs">
          <Nav.Item>
            <NavLink href="/create">Introduction</NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create/race">Race</NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create/theme" disabled={selectedRace === null}>
              Thème
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create/class" disabled={selectedTheme === null}>
              Classe
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create/profile" disabled={selectedClass === null}>
              Profil
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create/ability-scores" disabled={selectedClass === null}>
              Caractéristiques & Compétences
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create/feats" disabled={selectedClass === null}>
              Don(s)
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create/spells" disabled={selectedClass === null || !selectedClass.spellCaster}>
              Sorts
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create/equipment" disabled={selectedClass === null}>
              Équipement
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create/sheet">Fiche</NavLink>
          </Nav.Item>
          {debug && (
            <Nav.Item>
              <NavLink href="/create/debug">Debug</NavLink>
            </Nav.Item>
          )}
        </Nav>
        <Row id="content">{children}</Row>
      </Container>
    </>
  );
}
