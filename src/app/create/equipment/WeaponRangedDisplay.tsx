"use client";

import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { EquipmentDescriptor, EquipmentWeaponRanged } from "model";
import { DisplayCritical, DisplayDamageLong, DisplaySpecials } from "./Components";
import { EquipmentDisplay, useEquipment } from "./EquipmentDisplay";

export function WeaponRangedDisplay({ descriptor, selected }: { descriptor: EquipmentDescriptor; selected: boolean }) {
  const data = useAppSelector((state) => state.data);
  const equipment = useEquipment<EquipmentWeaponRanged>(descriptor);

  if (!equipment) {
    return null;
  }

  const subtitle =
    findOrError(data.weaponTypes, equipment.weaponType).name +
    (equipment.hands === 2 ? " à deux mains" : " à une main");
  return (
    <EquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle} selected={selected}>
      <div>
        {equipment.range * 1.5}m
        {equipment.damage && (
          <span>
            {" - "}
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
      {equipment.specials.length > 0 && (
        <div>
          <DisplaySpecials specials={equipment.specials} />
        </div>
      )}
      <div>
        {equipment.ammunition.type} ({equipment.ammunition.usage}/{equipment.ammunition.capacity})
      </div>
    </EquipmentDisplay>
  );
}
