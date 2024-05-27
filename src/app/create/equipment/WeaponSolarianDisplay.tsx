"use client";

import { EquipmentDescriptor, EquipmentWeaponSolarian } from "model";
import { DisplayCritical, DisplayDamageLong } from "./Components";
import { GenericEquipmentDisplay, useEquipment } from "./GenericEquipmentDisplay";

export function WeaponSolarianDisplay({
  descriptor,
  selected,
}: Readonly<{
  descriptor: EquipmentDescriptor;
  selected: boolean;
}>) {
  const equipment = useEquipment<EquipmentWeaponSolarian>(descriptor);

  if (!equipment) {
    return null;
  }

  const subtitle = "Crystal de combat solarien";
  return (
    <GenericEquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle} selected={selected}>
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
    </GenericEquipmentDisplay>
  );
}
