"use client";

import { findOrError, groupBy } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { Critical, Damage, EquipmentBase, EquipmentWeaponMelee, Special, WeaponTypeId, WeaponTypeIds } from "model";
import { useEffect, useState } from "react";
import { Badge, Button, Form, Table, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
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

function WeaponMeleeTableCategory({
  weaponType,
  equipments,
}: {
  weaponType: WeaponTypeId;
  equipments: EquipmentWeaponMelee[];
}) {
  const dispatch = useAppDispatch();
  const weaponCategories = useAppSelector((state) => state.data.weaponCategories);
  const groupedByCategory = groupBy(
    equipments,
    (e) => weaponCategories.find((c) => c.id === e.weaponCategory)?.name ?? ""
  );

  function handleAdd(id: string) {
    dispatch(mutators.addEquipment({ type1: "weapon", type2: weaponType, id }));
  }

  const keys = Object.keys(groupedByCategory).toSorted();
  return keys.map((category) => (
    <>
      <tr key={category}>
        <td colSpan={10} className="bg-transparent">
          <Badge bg="secondary">{category === "" ? "Sans catégorie" : category}</Badge>
        </td>
      </tr>
      {groupedByCategory[category].map((equipment) => (
        <tr key={equipment.id}>
          <td className="p-0">
            <Button variant="link" onClick={() => handleAdd(equipment.id)}>
              <i className="bi bi-cart-plus" />
            </Button>
          </td>
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
    </>
  ));
}

function WeaponMeleeTable({ weaponType, equipments }: { weaponType: WeaponTypeId; equipments: EquipmentBase[] }) {
  const casted = equipments as EquipmentWeaponMelee[];
  const groupedByHands = groupBy(casted, (e) => e.hands);

  return (
    <Table hover>
      <thead>
        <tr>
          <th></th>
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
            <td colSpan={10}>
              <em>En cours de chargement...</em>
            </td>
          </tr>
        </tbody>
      )}
      {[1, 2].map((hands) => {
        if (hands !== 1 && hands !== 2) {
          return null;
        }
        if (groupedByHands[hands] === undefined) {
          return null;
        }

        return (
          <tbody key={hands} className="table-group-divider">
            <tr>
              <td colSpan={10} className="bg-primary">
                <em>
                  Armes à {hands} {hands > 1 ? "mains" : "main"}
                </em>
              </td>
            </tr>
            <WeaponMeleeTableCategory weaponType={weaponType} equipments={groupedByHands[hands]} />
          </tbody>
        );
      })}
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
      {equipmentType === "weapon" && weaponType === "basic" && (
        <WeaponMeleeTable weaponType="basic" equipments={filtered} />
      )}
      {equipmentType === "weapon" && weaponType === "advanced" && (
        <WeaponMeleeTable weaponType="advanced" equipments={filtered} />
      )}
    </Stack>
  );
}
