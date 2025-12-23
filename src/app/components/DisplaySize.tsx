"use client";

import { findOrError } from "app/helpers";
import { useStaticData } from "logic/StaticContext";
import { SizeId } from "model";

export function DisplaySize({ value }: Readonly<{ value: SizeId }>) {
  const sizes = useStaticData().sizes;
  const size = findOrError(sizes, value);

  return size.name;
}
