"use client";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { v4 as uuidv4 } from "uuid";
import { mutators, useAppDispatch } from "logic";
import type { EquipmentAugmentation, EquipmentBase } from "model";
import { DisplaySystems } from "./Components";

function ArmorUpgradeTableCategory({ equipments }: Readonly<{ equipments: EquipmentAugmentation[] }>) {
  const dispatch = useAppDispatch();

  function handleAdd(equipment: EquipmentBase) {
    dispatch(
      mutators.addEquipment({
        id: uuidv4(),
        type: "unique",
        category: "other",
        secondaryType: "augmentation",
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
      <td>
        <DisplaySystems systems={equipment.systems} />
      </td>
    </tr>
  ));
}

export function OtherAugmentationTable({ equipments }: Readonly<{ equipments: EquipmentBase[] }>) {
  const casted = equipments as EquipmentAugmentation[];

  return (
    <Table hover>
      <thead>
        <tr>
          <th></th>
          <th>Nom</th>
          <th>Niveau</th>
          <th>Prix</th>
          <th>Organe</th>
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
