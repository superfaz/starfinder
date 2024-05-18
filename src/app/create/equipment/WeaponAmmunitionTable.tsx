"use client";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { v4 as uuidv4 } from "uuid";
import { mutators, useAppDispatch } from "logic";
import { EquipmentBase, EquipmentWeaponAmmunition } from "model";

function WeaponAmmunitionTableCategory({ equipments }: { equipments: EquipmentWeaponAmmunition[] }) {
  const dispatch = useAppDispatch();

  function handleAdd(equipment: EquipmentBase) {
    dispatch(
      mutators.addEquipment({
        id: uuidv4(),
        type: "consumable",
        category: "weapon",
        secondaryType: "ammunition",
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
      <td>{equipment.capacity}</td>
      <td>{equipment.weight}</td>
      <td>{equipment.specials ?? "-"}</td>
    </tr>
  ));
}

export function WeaponAmmunitionTable({ equipments }: { equipments: EquipmentBase[] }) {
  const casted = equipments as EquipmentWeaponAmmunition[];

  return (
    <Table hover>
      <thead>
        <tr>
          <th></th>
          <th>Nom</th>
          <th>Niveau</th>
          <th>Prix</th>
          <th>Capacité</th>
          <th>Volume</th>
          <th>Spécial</th>
        </tr>
      </thead>
      {casted.length === 0 && (
        <tbody className="table-group-divider">
          <tr>
            <td colSpan={7}>
              <em>En cours de chargement...</em>
            </td>
          </tr>
        </tbody>
      )}
      {[false, true].map((special) => {
        const filtered = casted.filter((e) => (e.category === "special") === special);
        if (filtered.length === 0) return null;

        return (
          <tbody key={"ammunition-" + special} className="table-group-divider">
            <tr>
              <td colSpan={7} className="bg-primary">
                <em>{special ? "Munitions spéciales" : "Munitions standards"}</em>
              </td>
            </tr>
            <WeaponAmmunitionTableCategory equipments={filtered} />
          </tbody>
        );
      })}
    </Table>
  );
}
