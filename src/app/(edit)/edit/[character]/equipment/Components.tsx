"use client";

import { Fragment, useEffect, useState } from "react";
import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import {
  EquipmentAugmentationCategory,
  EquipmentAugmentationSystem,
  EquipmentWeaponFusion,
} from "model";

export function DisplayFusions({ fusions }: Readonly<{ fusions: string[] }>) {
  const [elements, setElements] = useState<EquipmentWeaponFusion[]>([]);

  useEffect(() => {
    fetch("/api/equipment/weapons/fusions")
      .then((response) => response.json())
      .then((data) => {
        setElements(data.filter((f: EquipmentWeaponFusion) => fusions.includes(f.id)));
      });
  }, [fusions]);

  return elements.map((f) => f.name).join(", ");
}

export function DisplaySystem({ system }: Readonly<{ system: EquipmentAugmentationSystem }>) {
  const bodyParts = useAppSelector((state) => state.data.bodyParts);
  const bodyPart = findOrError(bodyParts, system.part);

  if (system.quantity === "all") {
    return bodyPart.name + " (tous)";
  } else if (system.quantity === 1) {
    return bodyPart.name;
  } else {
    throw new Error(`Invalid quantity for ${system.id}: ${system.quantity}`);
  }
}

export function DisplaySystems({ systems }: Readonly<{ systems: EquipmentAugmentationSystem[] }>) {
  return systems.map((system, index) => (
    <Fragment key={system.id}>
      {index > 0 && ", "}
      <DisplaySystem system={system} />
    </Fragment>
  ));
}

export function DisplayAugmentationCategory({ category }: Readonly<{ category: EquipmentAugmentationCategory }>) {
  switch (category) {
    case "biotech":
      return "Biotechnologie";
    case "cybernetic":
      return "Cybernétique";
    case "personal":
      return "Personnelle";
    default:
      return category;
  }
}
