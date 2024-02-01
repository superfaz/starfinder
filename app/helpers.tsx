import { IModel } from "model";

export function findOrError<T extends IModel>(array: T[], predicate: ((value: T) => boolean) | string): T {
  if (predicate === undefined) {
    throw new Error("predicate is undefined");
  }

  if (typeof predicate === "string") {
    const result = array.find((element) => element.id === predicate);
    if (result === undefined) {
      throw new Error("Can't find element in array");
    }
    return result;
  } else {
    const result = array.find(predicate);
    if (result === undefined) {
      throw new Error("Can't find element in array");
    }
    return result;
  }
}

export function displayBonus(bonus: number): string {
  return bonus >= 0 ? `+${bonus}` : `${bonus}`;
}
