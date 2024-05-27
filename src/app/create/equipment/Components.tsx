"use client";

import { useEffect, useState } from "react";
import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { ArmorTypeId, Critical, Damage, EquipmentWeaponFusion, SizeId, Special } from "model";

export function DisplayDamageShort({ damage }: Readonly<{ damage?: Damage }>) {
  const damageTypes = useAppSelector((state) => state.data.damageTypes);

  if (damage === undefined) {
    return "-";
  }

  const types = damage.types.map((t) => findOrError(damageTypes, t).code).join(" & ");
  return `${damage.roll} ${types}`;
}

export function DisplayDamageLong({ damage }: Readonly<{ damage?: Damage }>) {
  const damageTypes = useAppSelector((state) => state.data.damageTypes);

  if (damage === undefined) {
    return "pas de dégâts";
  }

  const types = damage.types.map((t) => findOrError(damageTypes, t).name).join(" & ");
  return `${damage.roll} ${types}`;
}

export function DisplayCritical({ critical }: Readonly<{ critical?: Critical }>) {
  const criticalHitEffects = useAppSelector((state) => state.data.criticalHitEffects);
  if (!critical) {
    return "-";
  }

  const instance = findOrError(criticalHitEffects, critical.id);
  if (!critical.value) {
    return instance.name;
  } else {
    return instance.name + " " + critical.value;
  }
}

export function DisplaySpecials({ specials }: Readonly<{ specials: Special[] }>) {
  const weaponSpecialProperties = useAppSelector((state) => state.data.weaponSpecialProperties);

  if (specials === undefined || specials.length === 0) {
    return "-";
  }

  return specials
    .map((special) => {
      const name = findOrError(weaponSpecialProperties, special.id).name;
      return special.value ? `${name} (${special.value})` : name;
    })
    .join(", ");
}

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

export function Credits({ value }: Readonly<{ value?: number }>) {
  if (value === undefined || value === 0) {
    return "- Cr";
  } else {
    return value + " Cr";
  }
}

export function DisplayModifier({ value }: Readonly<{ value?: number }>) {
  if (value === undefined || value === 0) {
    return "-";
  } else if (value > 0) {
    return "+" + value;
  } else {
    return value;
  }
}

export function DisplayRange({ value }: Readonly<{ value?: number }>) {
  if (value === undefined || value === 0) {
    return "-";
  } else {
    return value * 1.5 + " m";
  }
}

export function DisplaySize({ value }: Readonly<{ value: SizeId }>) {
  const sizes = useAppSelector((state) => state.data.sizes);
  const size = findOrError(sizes, value);

  return size.name;
}

export function DisplayArmorTypes({ types }: Readonly<{ types: ArmorTypeId[] }>) {
  const armorTypes = useAppSelector((state) => state.data.armorTypes);

  if (types === undefined || types.length === 0) {
    return "Aucune";
  } else if (types.length === armorTypes.length) {
    return "Toutes";
  }

  return types
    .map((t) => findOrError(armorTypes, t).name)
    .map((n) => n.replace("Armures ", "").toLowerCase())
    .join(", ");
}
