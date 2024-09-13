"use client";

import { DisplayCritical, DisplayDamage, DisplaySpecials } from "app/components";
import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { EquipmentDescriptor, EquipmentWeaponMelee } from "model";
import { GenericEquipmentDisplay, useEquipment } from "./GenericEquipmentDisplay";

export function WeaponMeleeDisplay({
  descriptor,
  selected,
}: Readonly<{ descriptor: EquipmentDescriptor; selected: boolean }>) {
  const data = useAppSelector((state) => state.data);
  const equipment = useEquipment<EquipmentWeaponMelee>(descriptor);

  if (!equipment) {
    return null;
  }

  const subtitle =
    findOrError(data.weaponTypes, equipment.weaponType).name +
    (equipment.hands === 2 ? " à deux mains" : " à une main");
  return (
    <GenericEquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle} selected={selected}>
      {equipment.damage && (
        <div>
          <DisplayDamage long damage={equipment.damage} />
          {equipment.critical && (
            <span>
              {" - "}
              <DisplayCritical critical={equipment.critical} />
            </span>
          )}
        </div>
      )}
      {equipment.specials.length > 0 && (
        <div>
          <DisplaySpecials specials={equipment.specials} />
        </div>
      )}
    </GenericEquipmentDisplay>
  );
}
