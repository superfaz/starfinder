"use client";

import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { EquipmentDescriptor, EquipmentWeaponMelee } from "model";
import { DisplayCritical, DisplayDamageLong, DisplaySpecials } from "./Components";
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
          <DisplayDamageLong damage={equipment.damage} />
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
