"use client";

import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { Critical, Damage, EquipmentBase, EquipmentWeaponMelee, Special, WeaponTypeId, WeaponTypeIds } from "model";
import { useEffect, useState } from "react";
import { Form, Table, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";

function DisplayDamage({ damage }: { damage: Damage }) {
  const damageTypes = useAppSelector((state) => state.data.damageTypes);
  return (
    <span>
      {damage.roll} {damage.types.map((d) => findOrError(damageTypes, d).code).join(" & ")}
    </span>
  );
}

function DisplayCritical({ critical }: { critical: Critical | undefined }) {
  const criticalHitEffects = useAppSelector((state) => state.data.criticalHitEffects);
  if (!critical) {
    return "-";
  }

  const instance = findOrError(criticalHitEffects, critical.id);
  if (!critical.value) {
    return instance.name;
  } else {
    return instance.name + " " + critical.value;
  }
}

function DisplaySpecials({ specials }: { specials: Special[] }) {
  const weaponSpecialProperties = useAppSelector((state) => state.data.weaponSpecialProperties);

  return specials
    .map((special) => {
      const name = findOrError(weaponSpecialProperties, special.id).name;
      return special.value ? `${name} (${special.value})` : name;
    })
    .join(", ");
}

function equipmentSort(a: EquipmentBase, b: EquipmentBase): number {
  if (a.level !== b.level) {
    return a.level - b.level;
  } else {
    return a.name < b.name ? -1 : 1;
  }
}

function WeaponMeleeTable({ equipments }: { equipments: EquipmentBase[] }) {
  const casted = equipments as EquipmentWeaponMelee[];

  return (
    <Table hover>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Niveau</th>
          <th>Coût</th>
          <th>Dégâts</th>
          <th>Critique</th>
          <th>Volume</th>
          <th>Spécial</th>
        </tr>
      </thead>
      {casted.length === 0 && (
        <tbody className="table-group-divider">
          <tr>
            <td colSpan={9}>
              <em>En cours de chargement...</em>
            </td>
          </tr>
        </tbody>
      )}
      <tbody className="table-group-divider">
        {casted.map((equipment) => (
          <tr key={equipment.id}>
            <td>{equipment.name}</td>
            <td>{equipment.level}</td>
            <td>{equipment.cost}</td>
            <td>
              <DisplayDamage damage={equipment.damage} />
            </td>
            <td>
              <DisplayCritical critical={equipment.critical} />
            </td>
            <td>{equipment.weight}</td>
            <td>
              <DisplaySpecials specials={equipment.specials} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function EquipmentSelection() {
  const weaponTypes = useAppSelector((state) => state.data.weaponTypes);
  const [search, setSearch] = useState("");
  const [equipmentType, setEquipmentType] = useState("weapon");
  const [weaponType, setWeaponType] = useState<WeaponTypeId>(WeaponTypeIds.basic);
  const [levelFilter, setLevelFilter] = useState<boolean>(true);
  const [equipments, setEquipments] = useState<EquipmentBase[]>([]);

  const filtered = equipments
    .filter((e) => search === "" || e.name.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => !levelFilter || e.level <= 2);

  useEffect(() => {
    fetch(`/api/equipments/${equipmentType}/${weaponType}`)
      .then((res) => res.json())
      .then((data: EquipmentBase[]) => {
        setEquipments(data.toSorted(equipmentSort));
      });
  }, [equipmentType, weaponType]);

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Équipement disponible</h2>
      <Row className="mb-3 align-items-center">
        <Col xs="auto" className="ms-3">
          Filtres:
        </Col>
        <Col xs="auto">
          <Form.Select id="equipment-type" value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)}>
            <option value="weapon">Armes</option>
            <option value="armor" disabled>
              Armures
            </option>
            <option value="other" disabled>
              Autres
            </option>
          </Form.Select>
        </Col>
        {equipmentType === "weapon" && (
          <Col xs="auto">
            <Form.Select
              id="weapon-type"
              value={weaponType}
              onChange={(e) => setWeaponType(e.target.value as WeaponTypeId)}
            >
              {weaponTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        )}
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
      {equipmentType === "weapon" && weaponType === "basic" && <WeaponMeleeTable equipments={filtered} />}
    </Stack>
  );
}
