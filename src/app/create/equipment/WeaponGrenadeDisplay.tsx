"use client";

import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { EquipmentDescriptor, EquipmentWeaponGrenade } from "model";
import { DisplaySpecials } from "./Components";
import { EquipmentDisplay, useEquipment } from "./EquipmentDisplay";

export function WeaponGrenadeDisplay({ descriptor, selected }: { descriptor: EquipmentDescriptor; selected: boolean }) {
  const data = useAppSelector((state) => state.data);
  const equipment = useEquipment<EquipmentWeaponGrenade>(descriptor);

  if (!equipment) {
    return null;
  }

  const subtitle = findOrError(data.weaponTypes, equipment.weaponType).name;
  return (
    <EquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle} selected={selected}>
      <div>{equipment.range * 1.5}m</div>
      {equipment.specials.length > 0 && (
        <div>
          <DisplaySpecials specials={equipment.specials} />
        </div>
      )}
    </EquipmentDisplay>
  );
}
