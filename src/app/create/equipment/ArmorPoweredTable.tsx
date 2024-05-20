"use client";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { v4 as uuidv4 } from "uuid";
import { mutators, useAppDispatch } from "logic";
import { ArmorTypeId, EquipmentArmorPowered, EquipmentBase } from "model";
import { DisplayModifier, DisplaySize } from "./Components";

export function ArmorPoweredTable({ armorType, equipments }: { armorType: ArmorTypeId; equipments: EquipmentBase[] }) {
  const dispatch = useAppDispatch();
  const casted = equipments as EquipmentArmorPowered[];

  console.log(equipments.length, casted.length);

  function handleAdd(equipment: EquipmentBase) {
    dispatch(
      mutators.addEquipment({
        id: uuidv4(),
        type: "unique",
        category: "armor",
        secondaryType: armorType,
        equipmentId: equipment.id,
        unitaryCost: equipment.cost ?? 0,
        quantity: 1,
      })
    );
  }

  return (
    <Table hover>
      <thead>
        <tr>
          <th></th>
          <th>Modèle</th>
          <th>Niveau</th>
          <th>Prix</th>
          <th>Bonus CAE</th>
          <th>Bonus CAC</th>
          <th>Bonus DEX max.</th>
          <th>Malus aux tests</th>
          <th>Taille</th>
          <th>Emplacements d’armes</th>
          <th>Emplacements d’amélioration</th>
          <th>Volume</th>
        </tr>
      </thead>
      {casted.length === 0 && (
        <tbody className="table-group-divider">
          <tr>
            <td colSpan={12}>
              <em>En cours de chargement...</em>
            </td>
          </tr>
        </tbody>
      )}
      <tbody className="table-group-divider">
        {casted.map((equipment) => (
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
              <DisplayModifier value={equipment.eacBonus} />
            </td>
            <td>
              <DisplayModifier value={equipment.kacBonus} />
            </td>
            <td>
              <DisplayModifier value={equipment.maxDexBonus} />
            </td>
            <td>
              <DisplayModifier value={equipment.armorCheckPenalty} />
            </td>
            <td>
              <DisplaySize value={equipment.size} />
            </td>
            <td>{equipment.weaponSlots}</td>
            <td>{equipment.upgradeSlots}</td>
            <td>{equipment.weight}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
