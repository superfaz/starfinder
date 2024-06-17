"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { findOrError } from "app/helpers";
import { CharacterPresenter } from "logic";
import {
  ArmorTypeIds,
  EquipmentBase,
  EquipmentCategories,
  type EquipmentWeaponId,
  EquipmentWeaponIds,
  WeaponTypeIds,
  EquipmentCategory,
  EquipmentCategorySchema,
  EquipmentArmorId,
  EquipmentArmorIds,
  EquipmentOtherId,
  EquipmentOtherIds,
} from "model";
import { useCharacterPresenter } from "../helpers";
import { ArmorNormalTable } from "./ArmorNormalTable";
import { WeaponAmmunitionTable } from "./WeaponAmmunitionTable";
import { WeaponGrenadeTable } from "./WeaponGrenadeTable";
import { WeaponMeleeTable } from "./WeaponMeleeTable";
import { WeaponRangedTable } from "./WeaponRangedTable";
import { WeaponSolarianTable } from "./WeaponSolarianTable";
import { ArmorPoweredTable } from "./ArmorPoweredTable";
import { ArmorUpgradeTable } from "./ArmorUpgradeTable";
import { OtherAugmentationTable } from "./OtherAugmentationTable";

function equipmentSort(a: EquipmentBase, b: EquipmentBase): number {
  if (a.level !== b.level) {
    return a.level - b.level;
  } else {
    return a.name < b.name ? -1 : 1;
  }
}

interface SubMenu {
  id: EquipmentWeaponId | EquipmentArmorId | EquipmentOtherId;
  name: string;
  uri: string;
  proficient: boolean;
}

interface Menu {
  id: EquipmentCategory;
  name: string;
  disabled: boolean;
  submenu: SubMenu[];
}

function createMenu(presenter: CharacterPresenter): Menu[] {
  return [
    {
      id: EquipmentCategories.weapon,
      name: "Armes",
      disabled: false,
      submenu: [
        {
          id: EquipmentWeaponIds.basic,
          name: "Armes de corps à corps simples",
          uri: "/api/equipment/weapons/basic",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.basic),
        },
        {
          id: EquipmentWeaponIds.advanced,
          name: "Armes de corps à corps évoluées",
          uri: "/api/equipment/weapons/advanced",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.advanced),
        },
        {
          id: EquipmentWeaponIds.small,
          name: "Armes légères",
          uri: "/api/equipment/weapons/small",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.small),
        },
        {
          id: EquipmentWeaponIds.long,
          name: "Armes longues",
          uri: "/api/equipment/weapons/long",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.long),
        },
        {
          id: EquipmentWeaponIds.heavy,
          name: "Armes lourdes",
          uri: "/api/equipment/weapons/heavy",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.heavy),
        },
        {
          id: EquipmentWeaponIds.sniper,
          name: "Armes de précision",
          uri: "/api/equipment/weapons/sniper",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.sniper),
        },
        {
          id: EquipmentWeaponIds.grenade,
          name: "Grenades",
          uri: "/api/equipment/weapons/grenade",
          proficient: presenter.getWeaponProficiencies().includes(WeaponTypeIds.grenade),
        },
        {
          id: EquipmentWeaponIds.ammunition,
          name: "Munitions",
          uri: "/api/equipment/weapons/ammunition",
          proficient: true,
        },
        {
          id: EquipmentWeaponIds.solarian,
          name: "Cristaux de combat solariens",
          uri: "/api/equipment/weapons/solarian",
          proficient: presenter.getClass()?.id === "solarian",
        },
      ],
    },
    {
      id: EquipmentCategories.armor,
      name: "Armures",
      disabled: false,
      submenu: [
        {
          id: EquipmentArmorIds.light,
          name: "Armures légères",
          uri: "/api/equipment/armors/light",
          proficient: presenter.getArmorProficiencies().includes(ArmorTypeIds.light),
        },
        {
          id: EquipmentArmorIds.heavy,
          name: "Armures lourdes",
          uri: "/api/equipment/armors/heavy",
          proficient: presenter.getArmorProficiencies().includes(ArmorTypeIds.heavy),
        },
        {
          id: EquipmentArmorIds.powered,
          name: "Armures assistées",
          uri: "/api/equipment/armors/powered",
          proficient: presenter.getArmorProficiencies().includes(ArmorTypeIds.powered),
        },
        {
          id: EquipmentArmorIds.upgrade,
          name: "Améliorations d’armure",
          uri: "/api/equipment/armors/upgrade",
          proficient: true,
        },
      ],
    },
    {
      id: "other",
      name: "Autres",
      disabled: false,
      submenu: [
        {
          id: EquipmentOtherIds.augmentation,
          name: "Augmentations",
          uri: "/api/equipment/others/augmentation",
          proficient: true,
        },
      ],
    },
  ];
}

export function EquipmentSelection() {
  const presenter = useCharacterPresenter();
  const [search, setSearch] = useState("");
  const [equipmentType, setEquipmentType] = useState<EquipmentCategory>(EquipmentCategories.weapon);
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
    setEquipmentType(EquipmentCategorySchema.parse(event.target.value));
    setSubType(findOrError(menu, event.target.value).submenu[0].id);
  }

  function handleSubTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    setEquipments([]);
    setSubType(event.target.value);
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Équipement disponible</h2>
      <Row className="mb-3 align-items-center">
        <Col xs="auto" className="ms-3 d-none d-lg-block">
          Filtres:
        </Col>
        <Col lg="auto" className="mb-1 mb-lg-0">
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
        <Col lg="auto" className="mb-1 mb-lg-0">
          <Form.Select id="sub-type" value={subType} onChange={handleSubTypeChange} aria-label="Sous-catégorie">
            {subMenu.map((type) => (
              <option key={type.id} value={type.id} className={type.proficient ? undefined : "text-danger"}>
                {type.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg="auto" className="mb-1 mb-lg-0">
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
      {equipmentType === EquipmentCategories.weapon && !subMenuEntry.proficient && (
        <Alert variant="warning">
          <strong>Attention : </strong> Vous n&apos;êtes pas formé à l&apos;usage des {subMenuEntry.name}.
        </Alert>
      )}
      {equipmentType === EquipmentCategories.weapon &&
        (subType === EquipmentWeaponIds.basic || subType === EquipmentWeaponIds.advanced) && (
          <WeaponMeleeTable weaponType={subType} equipments={filtered} />
        )}
      {equipmentType === EquipmentCategories.weapon &&
        (subType === EquipmentWeaponIds.small ||
          subType === EquipmentWeaponIds.long ||
          subType === EquipmentWeaponIds.heavy ||
          subType === EquipmentWeaponIds.sniper) && <WeaponRangedTable weaponType={subType} equipments={filtered} />}
      {equipmentType === EquipmentCategories.weapon && subType === "grenade" && (
        <WeaponGrenadeTable equipments={filtered} />
      )}
      {equipmentType === EquipmentCategories.weapon && subType === EquipmentWeaponIds.ammunition && (
        <WeaponAmmunitionTable equipments={filtered} />
      )}
      {equipmentType === EquipmentCategories.weapon && subType === EquipmentWeaponIds.solarian && (
        <WeaponSolarianTable equipments={filtered} />
      )}

      {equipmentType === EquipmentCategories.armor && !subMenuEntry.proficient && (
        <Alert variant="warning">
          <strong>Attention : </strong> Vous n&apos;êtes pas formé à l&apos;usage des {subMenuEntry.name}.
        </Alert>
      )}
      {equipmentType === EquipmentCategories.armor &&
        (subType === EquipmentArmorIds.light || subType === EquipmentArmorIds.heavy) && (
          <ArmorNormalTable armorType={subType} equipments={filtered} />
        )}
      {equipmentType === EquipmentCategories.armor && subType === EquipmentArmorIds.powered && (
        <ArmorPoweredTable equipments={filtered} />
      )}
      {equipmentType === EquipmentCategories.armor && subType === EquipmentArmorIds.upgrade && (
        <ArmorUpgradeTable equipments={filtered} />
      )}
      {equipmentType === EquipmentCategories.other && subType === EquipmentOtherIds.augmentation && (
        <OtherAugmentationTable equipments={filtered} />
      )}
    </Stack>
  );
}
