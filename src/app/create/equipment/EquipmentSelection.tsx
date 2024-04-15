"use client";

import { findOrError } from "app/helpers";
import { CharacterPresenter } from "logic";
import { ArmorTypeIds, EquipmentBase, WeaponTypeIds } from "model";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Alert, Form, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { useCharacterPresenter } from "../helpers";
import { WeaponMeleeTable } from "./WeaponMeleeTable";
import { WeaponRangedTable } from "./WeaponRangedTable";
import { WeaponGrenadeTable } from "./WeaponGrenadeTable";
import { WeaponAmmunitionTable } from "./WeaponAmmunitionTable";
import { WeaponSolarianTable } from "./WeaponSolarianTable";
import { ArmorTable } from "./ArmorTable";

function equipmentSort(a: EquipmentBase, b: EquipmentBase): number {
  if (a.level !== b.level) {
    return a.level - b.level;
  } else {
    return a.name < b.name ? -1 : 1;
  }
}

function createMenu(presenter: CharacterPresenter) {
  return [
    {
      id: "weapon",
      name: "Armes",
      disabled: false,
      submenu: [
        {
          id: "basic",
          name: "Armes de corps à corps simples",
          uri: "/api/equipment/weapons/basic",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.basic),
        },
        {
          id: "advanced",
          name: "Armes de corps à corps évoluées",
          uri: "/api/equipment/weapons/advanced",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.advanced),
        },
        {
          id: "small",
          name: "Armes légères",
          uri: "/api/equipment/weapons/small",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.small),
        },
        {
          id: "long",
          name: "Armes longues",
          uri: "/api/equipment/weapons/long",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.long),
        },
        {
          id: "heavy",
          name: "Armes lourdes",
          uri: "/api/equipment/weapons/heavy",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.heavy),
        },
        {
          id: "sniper",
          name: "Armes de précision",
          uri: "/api/equipment/weapons/sniper",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.sniper),
        },
        {
          id: "grenade",
          name: "Grenades",
          uri: "/api/equipment/weapons/grenade",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.grenade),
        },
        {
          id: "ammunition",
          name: "Munitions",
          uri: "/api/equipment/weapons/ammunition",
          proficient: true,
        },
        {
          id: "solarian",
          name: "Cristaux de combat solariens",
          uri: "/api/equipment/weapons/solarian",
          proficient: presenter.getClass()?.id === "solarian",
        },
      ],
    },
    {
      id: "armor",
      name: "Armures",
      disabled: false,
      submenu: [
        {
          id: "light",
          name: "Armures légères",
          uri: "/api/equipment/armors/light",
          proficient: presenter.getArmorProficiencies().includes(ArmorTypeIds.light),
        },
        {
          id: "heavy",
          name: "Armures lourdes",
          uri: "/api/equipment/armors/heavy",
          proficient: presenter.getArmorProficiencies().includes(ArmorTypeIds.heavy),
        },
      ],
    },
    {
      id: "other",
      name: "Autres",
      disabled: true,
      submenu: [],
    },
  ];
}

export function EquipmentSelection() {
  const presenter = useCharacterPresenter();
  const [search, setSearch] = useState("");
  const [equipmentType, setEquipmentType] = useState("weapon");
  const [subType, setSubType] = useState<string>(WeaponTypeIds.basic);
  const [levelFilter, setLevelFilter] = useState<boolean>(true);
  const [equipments, setEquipments] = useState<EquipmentBase[]>([]);

  const menu = useMemo(() => createMenu(presenter), [presenter]);
  const subMenu = useMemo(() => findOrError(menu, equipmentType).submenu, [menu, equipmentType]);

  const subMenuEntry = useMemo(
    () => findOrError(findOrError(menu, equipmentType).submenu, subType),
    [menu, equipmentType, subType]
  );

  const filtered = equipments
    .filter((e) => search === "" || e.name.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => !levelFilter || e.level <= 2);

  useEffect(() => {
    fetch(subMenuEntry.uri)
      .then((res) => res.json())
      .then((data: EquipmentBase[]) => {
        setEquipments(data.toSorted(equipmentSort));
      });
  }, [subMenuEntry]);

  function handleEquipmentTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    setEquipments([]);
    setEquipmentType(event.target.value);
    setSubType(findOrError(menu, event.target.value).submenu[0].id);
  }

  function handleSubTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    setEquipments([]);
    setSubType(event.target.value);
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Équipement disponible</h2>
      <Row className="mb-3 align-items-center">
        <Col xs="auto" className="ms-3">
          Filtres:
        </Col>
        <Col xs="auto">
          <Form.Select
            id="equipment-type"
            value={equipmentType}
            onChange={handleEquipmentTypeChange}
            aria-label="Catégorie"
          >
            {menu.map((item) => (
              <option key={item.id} value={item.id} disabled={item.disabled}>
                {item.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs="auto">
          <Form.Select id="sub-type" value={subType} onChange={handleSubTypeChange} aria-label="Sous-catégorie">
            {subMenu.map((type) => (
              <option key={type.id} value={type.id} className={type.proficient ? undefined : "text-danger"}>
                {type.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs="auto">
          <ToggleButtonGroup
            type="radio"
            name="levelFilter"
            value={levelFilter.toString()}
            onChange={(v) => setLevelFilter(v === "true")}
          >
            <ToggleButton id="levelFilter-true" value="true" variant="outline-secondary">
              Mon niveau (+1)
            </ToggleButton>
            <ToggleButton id="levelFilter-false" value="false" variant="outline-secondary">
              Tous
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
        <Col>
          <FormControl
            type="search"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>
      {equipmentType === "weapon" && !subMenuEntry.proficient && (
        <Alert variant="warning">
          <strong>Attention : </strong> Vous n&apos;êtes pas formé à l&apos;usage des {subMenuEntry.name}.
        </Alert>
      )}
      {equipmentType === "weapon" && (subType === "basic" || subType === "advanced") && (
        <WeaponMeleeTable weaponType={subType} equipments={filtered} />
      )}
      {equipmentType === "weapon" &&
        (subType === "small" || subType === "long" || subType === "heavy" || subType === "sniper") && (
          <WeaponRangedTable weaponType={subType} equipments={filtered} />
        )}
      {equipmentType === "weapon" && subType === "grenade" && <WeaponGrenadeTable equipments={filtered} />}
      {equipmentType === "weapon" && subType === "ammunition" && <WeaponAmmunitionTable equipments={filtered} />}
      {equipmentType === "weapon" && subType === "solarian" && <WeaponSolarianTable equipments={filtered} />}

      {equipmentType === "armor" && !subMenuEntry.proficient && (
        <Alert variant="warning">
          <strong>Attention : </strong> Vous n&apos;êtes pas formé à l&apos;usage des {subMenuEntry.name}.
        </Alert>
      )}
      {equipmentType === "armor" && (subType === "light" || subType === "heavy") && (
        <ArmorTable armorType={subType} equipments={filtered} />
      )}
    </Stack>
  );
}
