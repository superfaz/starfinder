import { IModel } from "model";

export function findOrError<T extends IModel>(
  array: T[],
  predicateOrId: ((value: T) => boolean) | string | null | undefined
): T {
  if (predicateOrId === undefined || predicateOrId === null) {
    throw new Error("predicate is undefined");
  }

  if (typeof predicateOrId === "string") {
    const result = array.find((element) => element.id === predicateOrId);
    if (result === undefined) {
      throw new Error("Can't find element in array");
    }
    return result;
  } else {
    const result = array.find(predicateOrId);
    if (result === undefined) {
      throw new Error("Can't find element in array");
    }
    return result;
  }
}

export function displayBonus(bonus: number): string {
  return bonus >= 0 ? `+${bonus}` : `${bonus}`;
}

// https://stackoverflow.com/a/62765924
export function groupBy<T, K extends string | number | symbol>(arr: T[], key: (i: T) => K) {
  return arr.reduce(
    (groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>
  );
}
