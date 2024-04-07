"use client";

import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { EquipmentDescriptor, EquipmentWeaponMelee } from "model";
import { DisplayCritical, DisplayDamageLong, DisplaySpecials } from "./Components";

export function WeaponMeleeDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  const data = useAppSelector((state) => state.data);
  const [equipment, setEquipment] = useState<EquipmentWeaponMelee | null>(null);

  useEffect(() => {
    fetch(`/api/equipment/weapons/${descriptor.secondaryType}`)
      .then((res) => res.json())
      .then((data) => {
        const equipments = data as EquipmentWeaponMelee[];
        setEquipment(findOrError(equipments, (e) => e.id === descriptor.id));
      });
  });

  if (!equipment) {
    return null;
  }

  return (
    <Card>
      <Card.Body>
        <div>
          <strong>
            {equipment.name} (niv. {equipment.level})
          </strong>
        </div>
        <div className="mb-2 small">
          {findOrError(data.weaponTypes, equipment.weaponType).name}{" "}
          {equipment.hands === 2 ? "à deux mains" : "à une main"}
        </div>
        {equipment.damage && (
          <div>
            <DisplayDamageLong damage={equipment.damage} />
            {equipment.critical && (
              <span>
                - <DisplayCritical critical={equipment.critical} />
              </span>
            )}
          </div>
        )}
        {equipment.specials.length > 0 && (
          <div>
            <DisplaySpecials specials={equipment.specials} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
