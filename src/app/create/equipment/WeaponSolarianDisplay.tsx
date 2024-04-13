"use client";

import { useEffect, useState } from "react";
import { findOrError } from "app/helpers";
import { EquipmentDescriptor, EquipmentWeaponSolarian } from "model";
import { DisplayCritical, DisplayDamageLong } from "./Components";
import { EquipmentDisplay } from "./EquipmentDisplay";

export function WeaponSolarianDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  const [equipment, setEquipment] = useState<EquipmentWeaponSolarian | null>(null);

  useEffect(() => {
    fetch(`/api/equipment/weapons/${descriptor.secondaryType}`)
      .then((res) => res.json())
      .then((data) => {
        const equipments = data as EquipmentWeaponSolarian[];
        setEquipment(findOrError(equipments, (e) => e.id === descriptor.equipmentId));
      });
  });

  if (!equipment) {
    return null;
  }

  const subtitle = "Crystal de combat solarien";
  return (
    <EquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle}>
      <div>
        {equipment.damage && (
          <span>
            <DisplayDamageLong damage={equipment.damage} />
          </span>
        )}
        {equipment.critical && (
          <span>
            {" - "}
            <DisplayCritical critical={equipment.critical} />
          </span>
        )}
      </div>
    </EquipmentDisplay>
  );
}
