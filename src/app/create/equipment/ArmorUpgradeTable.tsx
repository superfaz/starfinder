"use client";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { v4 as uuidv4 } from "uuid";
import { mutators, useAppDispatch } from "logic";
import { EquipmentArmorUpgrade, EquipmentBase } from "model";
import { DisplayArmorTypes } from "./Components";

function ArmorUpgradeTableCategory({ equipments }: Readonly<{ equipments: EquipmentArmorUpgrade[] }>) {
  const dispatch = useAppDispatch();

  function handleAdd(equipment: EquipmentBase) {
    dispatch(
      mutators.addEquipment({
        id: uuidv4(),
        type: "unique",
        category: "armor",
        secondaryType: "upgrade",
        equipmentId: equipment.id,
        unitaryCost: equipment.cost ?? 0,
        quantity: 1,
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
      <td>{equipment.upgradeSlots}</td>
      <td>
        <DisplayArmorTypes types={equipment.armorTypes} />
      </td>
      <td>{equipment.weight}</td>
    </tr>
  ));
}

export function ArmorUpgradeTable({ equipments }: Readonly<{ equipments: EquipmentBase[] }>) {
  const casted = equipments as EquipmentArmorUpgrade[];

  return (
    <Table hover>
      <thead>
        <tr>
          <th></th>
          <th>Nom</th>
          <th>Niveau</th>
          <th>Prix</th>
          <th>Emplacements</th>
          <th>Type d&apos;armure</th>
          <th>Volume</th>
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
      <tbody className="table-group-divider">
        <ArmorUpgradeTableCategory equipments={casted} />
      </tbody>
    </Table>
  );
}
