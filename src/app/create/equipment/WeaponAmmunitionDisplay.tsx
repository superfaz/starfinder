"use client";

import { useEffect, useState } from "react";
import { findOrError } from "app/helpers";
import { EquipmentDescriptor, EquipmentWeaponAmmunition } from "model";
import { EquipmentDisplay } from "./EquipmentDisplay";

export function WeaponAmmunitionDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  const [equipment, setEquipment] = useState<EquipmentWeaponAmmunition | null>(null);

  useEffect(() => {
    fetch(`/api/equipment/weapons/${descriptor.secondaryType}`)
      .then((res) => res.json())
      .then((data) => {
        const equipments = data as EquipmentWeaponAmmunition[];
        setEquipment(findOrError(equipments, (e) => e.id === descriptor.equipmentId));
      });
  });

  if (!equipment) {
    return null;
  }

  const subtitle = equipment.specials ? "Munition spéciale" : "Munition";
  return (
    <EquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle}>
      <div>Capacité : {equipment.capacity}</div>
    </EquipmentDisplay>
  );
}
