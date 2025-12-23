"use client";

import { findOrError } from "app/helpers";
import { useStaticData } from "logic/StaticContext";
import { Damage } from "model";

export function DisplayDamage({ damage, long = false }: Readonly<{ damage?: Damage; long?: boolean }>) {
  const damageTypes = useStaticData().damageTypes;

  if (damage === undefined) {
    return "-";
  }

  if (long) {
    const types = damage.types.map((t) => findOrError(damageTypes, t).name).join(" & ");
    return `${damage.roll} ${types}`;
  } else {
    const types = damage.types.map((t) => findOrError(damageTypes, t).code).join(" & ");
    return `${damage.roll} ${types}`;
  }
}
