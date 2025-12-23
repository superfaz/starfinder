"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Container from "react-bootstrap/Container";
import { DefaultNavBar } from "app/DefaultNavBar";
import { IClientDataSet } from "data";
import StoreProvider from "logic/StoreProvider";
import { Character, IModel } from "model";
import { Nav } from "ui";
import { useCharacterPresenter } from "./helpers-client";

interface MenuItem {
  title: string;
  href: string;
  disabled?: boolean;
  subtitle?: string;
  active?: boolean;
}

function EditNav({ debug, id }: Readonly<{ debug: boolean; id: string }>) {
  const pathname = usePathname();
  const presenter = useCharacterPresenter();

  const selectedRace = presenter.getRace();
  const selectedTheme = presenter.getTheme();
  const selectedClass = presenter.getClass();

  const menuItems: MenuItem[] = [
    { title: "Edition", href: `/edit/${id}` },
    { title: "Race", href: `/edit/${id}/race`, subtitle: selectedRace?.name },
    {
      title: "Thème",
      href: `/edit/${id}/theme`,
      disabled: selectedRace === null,
      subtitle: selectedTheme?.name,
    },
    {
      title: "Classe",
      href: `/edit/${id}/class`,
      disabled: selectedTheme === null,
      subtitle: selectedClass?.name,
    },
    {
      title: "Profil",
      href: `/edit/${id}/profile`,
      disabled: selectedClass === null,
      subtitle: presenter.getName(),
    },
    {
      title: "Caractéristiques & Compétences",
      href: `/edit/${id}/ability-scores`,
      disabled: selectedClass === null,
    },
    { title: "Don(s)", href: `/edit/${id}/feats`, disabled: selectedClass === null },
  ];

  if (selectedClass?.spellCaster) {
    menuItems.push({
      title: "Sorts",
      href: `/edit/${id}/spells`,
    });
  }

  if (presenter.getMechanicStyle() === "drone") {
    menuItems.push({
      title: "Drone",
      href: `/edit/${id}/drone`,
    });
  }

  menuItems.push(
    { title: "Équipement", href: `/edit/${id}/equipment`, disabled: selectedClass === null },
    { title: "Fiche", href: `/edit/${id}/sheet` }
  );

  if (debug) {
    menuItems.push({ title: "Debug", href: `/edit/${id}/debug` });
  }

  const activeIndex = menuItems.findLastIndex((item) => pathname?.startsWith(item.href));
  const active = activeIndex === -1 ? undefined : menuItems[activeIndex];

  if (active) {
    active.active = true;
  }

  return (
    <Nav className="nav-create flex-column">
      {menuItems.map((item) => (
        <Nav.Item key={item.title}>
          <Nav.Link href={item.href} disabled={item.disabled} active={item.active} className="flex-fill">
            <span className="label">{item.title}</span>
            {item.subtitle && <span className="selected">{item.subtitle}</span>}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
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
  character: Character;
  classesDetails?: Record<string, IModel>;
  children: ReactNode;
}>) {
  return (
    <StoreProvider data={data} character={character} classesDetails={classesDetails}>
      <DefaultNavBar>
        <hr />
        <EditNav debug={debug} id={character.id} />
      </DefaultNavBar>
      <Container>{children}</Container>
    </StoreProvider>
  );
}
