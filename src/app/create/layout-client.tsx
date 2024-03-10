"use client";

import { clsx } from "clsx";
import { ReactNode, useEffect, useMemo } from "react";
import { Container, Navbar, Row } from "react-bootstrap";
import { CookiesProvider, useCookies } from "react-cookie";
import Link from "next/link";
import { IClientDataSet } from "data";
import { CharacterPresenter, mutators, useAppDispatch, useAppSelector } from "logic";
import StoreProvider from "logic/StoreProvider";
import { usePathname } from "next/navigation";
import { Nav } from "app/components/Nav";

export default function LayoutClient({
  data,
  debug,
  children,
}: Readonly<{ data: IClientDataSet; debug: boolean; children: ReactNode }>) {
  return (
    <StoreProvider data={data}>
      <CookiesProvider defaultSetOptions={{ path: "/", sameSite: "strict" }}>
        <LayoutClientPresenter debug={debug}>{children}</LayoutClientPresenter>
      </CookiesProvider>
    </StoreProvider>
  );
}

function LayoutClientPresenter({ debug, children }: Readonly<{ debug: boolean; children: ReactNode }>) {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.data);
  const navigation = useAppSelector((state) => state.navigation);
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

  function handleNavigation(eventKey: string | null): void {
    dispatch(mutators.updateNavigation(eventKey ?? ""));
  }

  function NavLink({
    children,
    href,
    eventKey,
    disabled,
  }: {
    children: ReactNode;
    href: string;
    eventKey: string;
    disabled?: boolean;
  }) {
    return (
      <Link
        href={href}
        className={clsx("nav-link", pathname === href && navigation === eventKey && "active", disabled && "disabled")}
        onClick={() => !disabled && handleNavigation(eventKey)}
      >
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
            <NavLink href="/create" eventKey="intro">
              Introduction
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <Link href="/create/race" className={clsx("nav-link", { active: pathname === "/create/race" })}>
              Race
            </Link>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create" eventKey="theme" disabled={selectedRace === null}>
              Thème
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create" eventKey="class" disabled={selectedTheme === null}>
              Classe
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create" eventKey="profile" disabled={selectedClass === null}>
              Profil
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create" eventKey="abilityScores" disabled={selectedClass === null}>
              Caractéristiques & Compétences
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create" eventKey="feats" disabled={selectedClass === null}>
              Don(s)
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create" eventKey="spells" disabled={selectedClass === null || !selectedClass.spellCaster}>
              Sorts
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create" eventKey="equipment" disabled={selectedClass === null}>
              Équipement
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink href="/create" eventKey="sheet">
              Fiche
            </NavLink>
          </Nav.Item>
          {debug && (
            <Nav.Item>
              <Link href="/create/debug" className={clsx("nav-link", { active: pathname === "/create/debug" })}>
                Debug
              </Link>
            </Nav.Item>
          )}
        </Nav>
        <Row id="content">{children}</Row>
      </Container>
    </>
  );
}
