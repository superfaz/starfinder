"use client";

import { EquipmentDescriptor, EquipmentWeaponAmmunition } from "model";
import { EquipmentDisplay, useEquipment } from "./EquipmentDisplay";

export function WeaponAmmunitionDisplay({
  descriptor,
  selected,
}: {
  descriptor: EquipmentDescriptor;
  selected: boolean;
}) {
  const equipment = useEquipment<EquipmentWeaponAmmunition>(descriptor);

  if (!equipment) {
    return null;
  }

  const subtitle = equipment.specials ? "Munition spéciale" : "Munition";
  return (
    <EquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle} selected={selected}>
      <div>Capacité : {equipment.capacity}</div>
    </EquipmentDisplay>
  );
}
