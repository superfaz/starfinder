"use client";

import { EquipmentArmorUpgrade, EquipmentDescriptor } from "model";
import { DisplayArmorTypes } from "./Components";
import { GenericEquipmentDisplay, useEquipment } from "./GenericEquipmentDisplay";

export function ArmorUpgradeDisplay({ descriptor, selected }: { descriptor: EquipmentDescriptor; selected: boolean }) {
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
