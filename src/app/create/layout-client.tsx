"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import { CookiesProvider, useCookies } from "react-cookie";
import AuthMenu from "app/AuthMenu";
import { Nav } from "app/components/Nav";
import { IClientDataSet } from "data";
import { CharacterPresenter, useAppSelector } from "logic";
import StoreProvider from "logic/StoreProvider";
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

interface MenuItem {
  title: string;
  href: string;
  disabled?: boolean;
  subtitle?: string;
  active?: boolean;
}

function LayoutClientPresenter({ debug, children }: Readonly<{ debug: boolean; children: ReactNode }>) {
  const pathname = usePathname();
  const data = useAppSelector((state) => state.data);
  const character = useAppSelector((state) => state.character);
  const classesDetails = useAppSelector((state) => state.classesDetails);
  const [expanded, setExpanded] = useState(false);
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

  const menuItems: MenuItem[] = [
    { title: "Intro", href: "/create" },
    { title: "Race", href: "/create/race", subtitle: selectedRace?.name },
    { title: "Thème", href: "/create/theme", disabled: selectedRace === null, subtitle: selectedTheme?.name },
    { title: "Classe", href: "/create/class", disabled: selectedTheme === null, subtitle: selectedClass?.name },
    { title: "Profil", href: "/create/profile", disabled: selectedClass === null, subtitle: character.name },
    { title: "Caractéristiques & Compétences", href: "/create/ability-scores", disabled: selectedClass === null },
    { title: "Don(s)", href: "/create/feats", disabled: selectedClass === null },
  ];

  if (selectedClass?.spellCaster) {
    menuItems.push({
      title: "Sorts",
      href: "/create/spells",
    });
  }

  menuItems.push(
    { title: "Équipement", href: "/create/equipment", disabled: selectedClass === null },
    { title: "Fiche", href: "/create/sheet" }
  );

  if (debug) {
    menuItems.push({ title: "Debug", href: "/create/debug" });
  }

  const activeIndex = menuItems.findLastIndex((item) => pathname?.startsWith(item.href));
  const active = activeIndex === -1 ? undefined : menuItems[activeIndex];
  const next = activeIndex + 1 === menuItems.length ? undefined : menuItems[activeIndex + 1];

  if (active) {
    active.active = true;
  }

  return (
    <>
      <div className="sticky-top">
        <Navbar expand="xl" className="nav-create p-xl-0" expanded={expanded} onToggle={setExpanded}>
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Brand className="d-block d-xl-none">{active?.title}</Navbar.Brand>
            <Navbar.Text className="d-block d-xl-none">
              {next && (
                <Link
                  href={next.href}
                  className={clsx("btn", next.disabled ? "disabled btn-secondary" : "btn-primary")}
                >
                  <i className="bi bi-caret-right"></i>
                </Link>
              )}
            </Navbar.Text>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="flex-column flex-xl-row justify-content-xl-center" data-testid="tabs">
                {menuItems.map((item) => (
                  <Nav.Item key={item.title}>
                    <Nav.Link
                      href={item.href}
                      disabled={item.disabled}
                      active={item.active}
                      className="flex-fill"
                      onClick={() => setExpanded(false)}
                    >
                      <span className="label">{item.title}</span>
                      {item.subtitle && <span className="selected">{item.subtitle}</span>}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
              <Nav className="ms-auto">
                <AuthMenu />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <ProgressBar
          className="rounded-0 d-xl-none"
          style={{ height: "0.25em" }}
          now={((activeIndex + 1) / menuItems.length) * 100}
        />
      </div>

      <Container className="mt-3">
        <Row id="content">{children}</Row>
      </Container>
    </>
  );
}
