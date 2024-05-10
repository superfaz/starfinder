"use client";

import { useEffect, useState } from "react";
import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { EquipmentDescriptor, EquipmentWeaponMelee } from "model";
import { DisplayCritical, DisplayDamageLong, DisplaySpecials } from "./Components";
import { EquipmentDisplay } from "./EquipmentDisplay";

export function WeaponMeleeDisplay({ descriptor, selected }: { descriptor: EquipmentDescriptor; selected: boolean }) {
  const data = useAppSelector((state) => state.data);
  const [equipment, setEquipment] = useState<EquipmentWeaponMelee | null>(null);

  useEffect(() => {
    fetch(`/api/equipment/weapons/${descriptor.secondaryType}`)
      .then((res) => res.json())
      .then((data) => {
        const equipments = data as EquipmentWeaponMelee[];
        setEquipment(findOrError(equipments, (e) => e.id === descriptor.equipmentId));
      });
  }, [descriptor.secondaryType, descriptor.equipmentId]);

  if (!equipment) {
    return null;
  }

  const subtitle =
    findOrError(data.weaponTypes, equipment.weaponType).name +
    (equipment.hands === 2 ? " à deux mains" : " à une main");
  return (
    <EquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle} selected={selected}>
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
    </EquipmentDisplay>
  );
}
