"use client";

import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { Special } from "model";

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
