"use client";

import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { Critical, Damage, Special } from "model";

export function DisplayDamage({ damage }: { damage?: Damage }) {
  const damageTypes = useAppSelector((state) => state.data.damageTypes);

  if (damage === undefined) {
    return null;
  }

  return (
    <span>
      {damage.roll} {damage.types.map((d) => findOrError(damageTypes, d).code).join(" & ")}
    </span>
  );
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

  return specials
    .map((special) => {
      const name = findOrError(weaponSpecialProperties, special.id).name;
      return special.value ? `${name} (${special.value})` : name;
    })
    .join(", ");
}
