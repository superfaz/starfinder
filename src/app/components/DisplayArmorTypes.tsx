import { findOrError } from "app/helpers";
import { useStaticData } from "logic/StaticContext";
import { ArmorTypeId } from "model";

export function DisplayArmorTypes({ types }: Readonly<{ types: ArmorTypeId[] }>) {
  const armorTypes = useStaticData().armorTypes;

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
