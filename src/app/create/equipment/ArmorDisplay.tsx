"use client";

import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { EquipmentArmor, EquipmentDescriptor } from "model";
import { DisplayModifier, DisplayRange } from "./Components";
import { EquipmentDisplay, useEquipment } from "./EquipmentDisplay";

export function ArmorDisplay({ descriptor, selected }: { descriptor: EquipmentDescriptor; selected: boolean }) {
  const data = useAppSelector((state) => state.data);
  const equipment = useEquipment<EquipmentArmor>(descriptor);

  if (!equipment) {
    return null;
  }

  const subtitle = findOrError(data.armorTypes, equipment.type).name;
  return (
    <EquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle} selected={selected}>
      <div>
        CAE: <DisplayModifier value={equipment.eacBonus} />
        {" / "}
        CAC: <DisplayModifier value={equipment.kacBonus} />
        {" / "}
        DEX Max: <DisplayModifier value={equipment.maxDexBonus} />
      </div>
      {equipment.armorCheckPenalty !== 0 && (
        <div>
          Malus aux tests: <DisplayModifier value={equipment.armorCheckPenalty} />
        </div>
      )}
      {equipment.speedAdjustment !== 0 && (
        <div>
          Modificateur de vitesse: <DisplayRange value={equipment.speedAdjustment} />
        </div>
      )}
    </EquipmentDisplay>
  );
}
