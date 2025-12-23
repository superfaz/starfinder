"use client";

import { Fragment } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { v4 as uuidv4 } from "uuid";
import { DisplayCritical, DisplayDamage, DisplaySpecials } from "app/components";
import { groupBy } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { EquipmentBase, EquipmentWeaponMelee, WeaponTypeId } from "model";
import { Badge } from "ui";

function WeaponMeleeTableCategory({
  weaponType,
  equipments,
}: Readonly<{
  weaponType: WeaponTypeId;
  equipments: EquipmentWeaponMelee[];
}>) {
  const dispatch = useAppDispatch();
  const weaponCategories = useAppSelector((state) => state.data.weaponCategories);
  const groupedByCategory = groupBy(
    equipments,
    (e) => weaponCategories.find((c) => c.id === e.weaponCategory)?.name ?? ""
  );

  function handleAdd(equipment: EquipmentBase) {
    dispatch(
      mutators.addEquipment({
        id: uuidv4(),
        type: "unique",
        category: "weapon",
        secondaryType: weaponType,
        equipmentId: equipment.id,
        unitaryCost: equipment.cost ?? 0,
        quantity: 1,
      })
    );
  }

  const keys = Object.keys(groupedByCategory).toSorted((a, b) => a.localeCompare(b));
  return keys.map((category) => (
    <Fragment key={category}>
      <tr>
        <td colSpan={8} className="bg-transparent">
          <Badge bg="secondary">{category === "" ? "Sans catégorie" : category}</Badge>
        </td>
      </tr>
      {groupedByCategory[category].map((equipment) => (
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
    </Fragment>
  ));
}

export function WeaponMeleeTable({
  weaponType,
  equipments,
}: Readonly<{
  weaponType: WeaponTypeId;
  equipments: EquipmentBase[];
}>) {
  const casted = equipments as EquipmentWeaponMelee[];
  const groupedByHands = groupBy(casted, (e) => e.hands);

  return (
    <Table hover>
      <thead>
        <tr>
          <th></th>
          <th>Nom</th>
          <th>Niveau</th>
          <th>Prix</th>
          <th>Dégâts</th>
          <th>Critique</th>
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
              <td colSpan={8} className="bg-primary">
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
