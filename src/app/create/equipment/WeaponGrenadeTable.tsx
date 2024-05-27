"use client";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { v4 as uuidv4 } from "uuid";
import { mutators, useAppDispatch } from "logic";
import { EquipmentBase, EquipmentWeaponGrenade } from "model";
import { DisplaySpecials } from "./Components";

function WeaponGrenadeTableCategory({ equipments }: Readonly<{ equipments: EquipmentWeaponGrenade[] }>) {
  const dispatch = useAppDispatch();

  function handleAdd(equipment: EquipmentBase) {
    dispatch(
      mutators.addEquipment({
        id: uuidv4(),
        type: "consumable",
        category: "weapon",
        secondaryType: "grenade",
        equipmentId: equipment.id,
        quantity: 1,
        unitaryCost: equipment.cost ?? 0,
      })
    );
  }

  return equipments.map((equipment) => (
    <tr key={equipment.id}>
      <td className="p-0">
        <Button variant="link" onClick={() => handleAdd(equipment)}>
          <i className="bi bi-cart-plus" />
        </Button>
      </td>
      <td>{equipment.name}</td>
      <td>{equipment.level}</td>
      <td>{equipment.cost}</td>
      <td>{equipment.range * 1.5} m</td>
      <td>{equipment.capacity}</td>
      <td>{equipment.weight}</td>
      <td>
        <DisplaySpecials specials={equipment.specials} />
      </td>
    </tr>
  ));
}

export function WeaponGrenadeTable({ equipments }: Readonly<{ equipments: EquipmentBase[] }>) {
  const casted = equipments as EquipmentWeaponGrenade[];

  return (
    <Table hover>
      <thead>
        <tr>
          <th></th>
          <th>Nom</th>
          <th>Niveau</th>
          <th>Prix</th>
          <th>Portée</th>
          <th>Capacité</th>
          <th>Volume</th>
          <th>Spécial</th>
        </tr>
      </thead>
      {casted.length === 0 && (
        <tbody className="table-group-divider">
          <tr>
            <td colSpan={8}>
              <em>En cours de chargement...</em>
            </td>
          </tr>
        </tbody>
      )}
      <tbody className="table-group-divider">
        <WeaponGrenadeTableCategory equipments={casted} />
      </tbody>
    </Table>
  );
}
