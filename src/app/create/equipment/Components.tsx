"use client";

import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { Critical, Damage, Special } from "model";

export function DisplayDamageShort({ damage }: { damage?: Damage }) {
  const damageTypes = useAppSelector((state) => state.data.damageTypes);

  if (damage === undefined) {
    return "-";
  }

  const types = damage.types.map((t) => findOrError(damageTypes, t).code).join(" & ");
  return `${damage.roll} ${types}`;
}

export function DisplayDamageLong({ damage }: { damage?: Damage }) {
  const damageTypes = useAppSelector((state) => state.data.damageTypes);

  if (damage === undefined) {
    return "pas de dégâts";
  }

  const types = damage.types.map((t) => findOrError(damageTypes, t).name).join(" & ");
  return `${damage.roll} ${types}`;
}

export function DisplayCritical({ critical }: { critical?: Critical }) {
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

export function DisplaySpecials({ specials }: { specials: Special[] }) {
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

export function Credits({ value }: { value?: number }) {
  if (value === undefined || value === 0) {
    return "- Cr";
  } else {
    return value + " Cr";
  }
}

export function DisplayModifier({ value }: { value?: number }) {
  if (value === undefined || value === 0) {
    return "-";
  } else if (value > 0) {
    return "+" + value;
  } else {
    return value;
  }
}

export function DisplayRange({ value }: { value?: number }) {
  if (value === undefined || value === 0) {
    return "-";
  } else {
    return value * 1.5 + " m";
  }
}
