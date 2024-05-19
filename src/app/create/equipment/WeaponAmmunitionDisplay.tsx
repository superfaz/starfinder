"use client";

import { EquipmentDescriptor, EquipmentWeaponAmmunition } from "model";
import { GenericEquipmentDisplay, useEquipment } from "./GenericEquipmentDisplay";

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
    <GenericEquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle} selected={selected}>
      <div>Capacité : {equipment.capacity}</div>
    </GenericEquipmentDisplay>
  );
}
