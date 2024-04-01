import { Button, Table } from "react-bootstrap";
import { mutators, useAppDispatch } from "logic";
import { EquipmentBase, EquipmentWeaponAmmunition } from "model";

function WeaponAmmunitionTableCategory({ equipments }: { equipments: EquipmentWeaponAmmunition[] }) {
  const dispatch = useAppDispatch();

  function handleAdd(id: string) {
    dispatch(mutators.addEquipment({ type1: "weaponAmmunition", type2: "ammunition", id }));
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
