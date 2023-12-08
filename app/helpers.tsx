export function findOrError<T>(array: T[], predicate: (value: T) => boolean): T {
  let result = array.find(predicate);
  if (result === undefined) {
    throw new Error("Can't find element in array");
  }
  return result;
}

export function displayBonus(bonus: number): string {
  return bonus > 0 ? `+${bonus}` : `${bonus}`;
}
