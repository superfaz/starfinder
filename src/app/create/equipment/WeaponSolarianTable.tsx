import { Button, Table } from "react-bootstrap";
import { mutators, useAppDispatch } from "logic";
import { EquipmentBase, EquipmentWeaponSolarian } from "model";
import { DisplayCritical, DisplayDamage } from "./Components";

function WeaponSolarianTableCategory({ equipments }: { equipments: EquipmentWeaponSolarian[] }) {
  const dispatch = useAppDispatch();

  function handleAdd(id: string) {
    dispatch(mutators.addEquipment({ type1: "weaponSolarian", type2: "solarian", id }));
  }

  return equipments.map((equipment) => (
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
    </tr>
  ));
}

export function WeaponSolarianTable({ equipments }: { equipments: EquipmentBase[] }) {
  const casted = equipments as EquipmentWeaponSolarian[];

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
        <WeaponSolarianTableCategory equipments={casted} />
      </tbody>
    </Table>
  );
}
