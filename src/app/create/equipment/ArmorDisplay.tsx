"use client";

import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { ArmorTypeIds, EquipmentArmor, EquipmentDescriptor } from "model";
import { DisplayDamageShort, DisplayModifier, DisplayRange, DisplaySize } from "./Components";
import { GenericEquipmentDisplay, useEquipment } from "./GenericEquipmentDisplay";

export function ArmorDisplay({ descriptor, selected }: Readonly<{ descriptor: EquipmentDescriptor; selected: boolean }>) {
  const data = useAppSelector((state) => state.data);
  const equipment = useEquipment<EquipmentArmor>(descriptor);

  if (!equipment) {
    return null;
  }

  const subtitle = findOrError(data.armorTypes, equipment.type).name;
  return (
    <GenericEquipmentDisplay descriptor={descriptor} equipment={equipment} subtitle={subtitle} selected={selected}>
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
      {equipment.type !== ArmorTypeIds.powered && (
        <>
          {equipment.speedAdjustment !== 0 && (
            <div>
              Modificateur de vitesse: <DisplayRange value={equipment.speedAdjustment} />
            </div>
          )}
          <div>Emplacement d’amélioration: {equipment.upgradeSlots}</div>
        </>
      )}
      {equipment.type === ArmorTypeIds.powered && (
        <>
          <div>
            Vitesse: <DisplayRange value={equipment.speed} />
            {" / "}Force: {equipment.strength}
            {" / "}Dégâts: <DisplayDamageShort damage={equipment.damage} />
          </div>
          <div>
            Taille: <DisplaySize value={equipment.size} />
            {" / "}Portée: <DisplayRange value={equipment.reach} />
          </div>
          <div>
            Capacité: {equipment.capacity}
            {" / "}Utilisation: {equipment.usage}
          </div>
          <div>Emplacement d’amélioration: {equipment.upgradeSlots}</div>
          <div>Emplacement d’armes: {equipment.weaponSlots}</div>
        </>
      )}
    </GenericEquipmentDisplay>
  );
}
