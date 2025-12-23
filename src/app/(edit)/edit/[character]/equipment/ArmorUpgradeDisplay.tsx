"use client";

import { DisplayArmorTypes } from "app/components";
import { EquipmentArmorUpgrade, EquipmentDescriptor } from "model";
import { GenericEquipmentDisplay, useEquipment } from "./GenericEquipmentDisplay";

export function ArmorUpgradeDisplay({
  descriptor,
  selected,
}: Readonly<{ descriptor: EquipmentDescriptor; selected: boolean }>) {
  const equipment = useEquipment<EquipmentArmorUpgrade>(descriptor);

  if (!equipment) {
    return null;
  }

  return (
    <GenericEquipmentDisplay
      descriptor={descriptor}
      equipment={equipment}
      subtitle="Amélioration d'armure"
      selected={selected}
    >
      <div>
        Types d&apos;armure: <DisplayArmorTypes types={equipment.armorTypes} />
      </div>
    </GenericEquipmentDisplay>
  );
}
