"use client";

import { EquipmentAugmentation, EquipmentDescriptor } from "model";
import { DisplayAugmentationCategory, DisplaySystems } from "./Components";
import { GenericEquipmentDisplay, useEquipment } from "./GenericEquipmentDisplay";

const subtitles = {
  cybernetic: "Implant cybernétique",
  biotech: "Implant biotech",
  personal: "Amélioration personnelle",
};

export function OtherAugmentationDisplay({
  descriptor,
  selected,
}: Readonly<{ descriptor: EquipmentDescriptor; selected: boolean }>) {
  const equipment = useEquipment<EquipmentAugmentation>(descriptor);

  if (!equipment) {
    return null;
  }

  return (
    <GenericEquipmentDisplay
      descriptor={descriptor}
      equipment={equipment}
      subtitle={subtitles[equipment.category]}
      selected={selected}
    >
      <div>
        Categorie: <DisplayAugmentationCategory category={equipment.category} />
      </div>
      <div>
        Organe: <DisplaySystems systems={equipment.systems} />
      </div>
    </GenericEquipmentDisplay>
  );
}
