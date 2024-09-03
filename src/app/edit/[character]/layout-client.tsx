"use client";

import { ReactNode } from "react";
import Container from "react-bootstrap/Container";
import { IClientDataSet } from "data";
import StoreProvider from "logic/StoreProvider";
import { Character, IModel } from "model";

export default function LayoutClient({
  data,
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
      <Container>{children}</Container>
    </StoreProvider>
  );
}

/*
interface MenuItem {
  title: string;
  href: string;
  disabled?: boolean;
  subtitle?: string;
  active?: boolean;
}

function LayoutClientPresenter({ debug, children }: Readonly<{ debug: boolean; children: ReactNode }>) {
  const pathname = usePathname();
  const { character } = useParams();
  const [expanded, setExpanded] = useState(false);
  const presenter = useCharacterPresenter();

  const selectedRace = presenter.getRace();
  const selectedTheme = presenter.getTheme();
  const selectedClass = presenter.getClass();

  const menuItems: MenuItem[] = [
    { title: "Intro", href: `/edit/${character}` },
    { title: "Race", href: `/edit/${character}/race`, subtitle: selectedRace?.name },
    {
      title: "Thème",
      href: `/edit/${character}/theme`,
      disabled: selectedRace === null,
      subtitle: selectedTheme?.name,
    },
    {
      title: "Classe",
      href: `/edit/${character}/class`,
      disabled: selectedTheme === null,
      subtitle: selectedClass?.name,
    },
    {
      title: "Profil",
      href: `/edit/${character}/profile`,
      disabled: selectedClass === null,
      subtitle: presenter.getName(),
    },
    {
      title: "Caractéristiques & Compétences",
      href: `/edit/${character}/ability-scores`,
      disabled: selectedClass === null,
    },
    { title: "Don(s)", href: `/edit/${character}/feats`, disabled: selectedClass === null },
  ];

  if (selectedClass?.spellCaster) {
    menuItems.push({
      title: "Sorts",
      href: `/edit/${character}/spells`,
    });
  }

  if (presenter.getMechanicStyle() === "drone") {
    menuItems.push({
      title: "Drone",
      href: `/edit/${character}/drone`,
    });
  }

  menuItems.push(
    { title: "Équipement", href: `/edit/${character}/equipment`, disabled: selectedClass === null },
    { title: "Fiche", href: `/edit/${character}/sheet` }
  );

  if (debug) {
    menuItems.push({ title: "Debug", href: `/edit/${character}/debug` });
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
        <Navbar expand="lg" className="navbar-create p-lg-0" expanded={expanded} onToggle={setExpanded}>
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Brand className="d-block d-lg-none">{active?.title}</Navbar.Brand>
            <Navbar.Text className="d-block d-lg-none">
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
              <Nav className="flex-column flex-lg-row justify-content-lg-center" data-testid="tabs">
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
          className="rounded-0 d-lg-none"
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
*/
