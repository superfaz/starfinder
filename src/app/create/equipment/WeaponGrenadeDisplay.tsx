"use client";

import { useEffect, useState } from "react";
import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { EquipmentDescriptor, EquipmentWeaponGrenade } from "model";
import { DisplaySpecials } from "./Components";
import { EquipmentDisplay } from "./EquipmentDisplay";

export function WeaponGrenadeDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  const data = useAppSelector((state) => state.data);
  const [equipment, setEquipment] = useState<EquipmentWeaponGrenade | null>(null);

  useEffect(() => {
    fetch(`/api/equipment/weapons/${descriptor.secondaryType}`)
      .then((res) => res.json())
      .then((data) => {
        const equipments = data as EquipmentWeaponGrenade[];
        setEquipment(findOrError(equipments, (e) => e.id === descriptor.equipmentId));
      });
  }, [descriptor.secondaryType, descriptor.equipmentId]);

  if (!equipment) {
    return null;
  }

  const subtitle = findOrError(data.weaponTypes, equipment.weaponType).name;
  return (
    <EquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle}>
      <div>{equipment.range * 1.5}m</div>
      {equipment.specials.length > 0 && (
        <div>
          <DisplaySpecials specials={equipment.specials} />
        </div>
      )}
    </EquipmentDisplay>
  );
}
