"use client";

import { useEffect, useState } from "react";
import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { EquipmentDescriptor, EquipmentWeaponRanged } from "model";
import { DisplayCritical, DisplayDamageLong, DisplaySpecials } from "./Components";
import { EquipmentDisplay } from "./EquipmentDisplay";

export function WeaponRangedDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  const data = useAppSelector((state) => state.data);
  const [equipment, setEquipment] = useState<EquipmentWeaponRanged | null>(null);

  useEffect(() => {
    fetch(`/api/equipment/weapons/${descriptor.secondaryType}`)
      .then((res) => res.json())
      .then((data) => {
        const equipments = data as EquipmentWeaponRanged[];
        setEquipment(findOrError(equipments, (e) => e.id === descriptor.id));
      });
  });

  if (!equipment) {
    return null;
  }

  const subtitle =
    findOrError(data.weaponTypes, equipment.weaponType).name +
    (equipment.hands === 2 ? " à deux mains" : " à une main");
  return (
    <EquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle}>
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
