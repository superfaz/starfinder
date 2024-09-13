"use client";

import { findOrError } from "app/helpers";
import { useAppSelector } from "logic";
import { Critical } from "model";

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
