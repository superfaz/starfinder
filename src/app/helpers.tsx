import { IModel, INamedModel } from "model";

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
      throw new Error(`Can't find element ${predicateOrId} in array`);
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

/**
 * Retrieves the name of the item in a data list or send the name back if it's not found.
 * @param data - The list of items
 * @param idOrName - The id of an item or the name to return back
 * @returns The name o the item if found, otherwise the idOrName
 */
export function idOrName<T extends INamedModel>(data: T[], idOrName: string | undefined): string | undefined {
  if (idOrName === undefined) {
    return undefined;
  }

  const name = data.find((l) => l.id === idOrName)?.name;
  return name ?? idOrName;
}
