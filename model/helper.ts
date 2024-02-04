import { z } from "zod";

export const Id = z.union([z.string().regex(/^([a-z]|[a-z][a-z0-9-]*[a-z0-9])$/), z.string().uuid()]);

export const Description = z.string().regex(/^[\p{Lu}0-9+-].+\.$/u);

export const Variable = z.string().regex(/^<[a-z][a-zA-Z]+>$/);

export function isVariable(value: string): boolean {
  return Variable.safeParse(value).success;
}

export type WithValue<T> = Extract<T, { value: number }>;

export function hasValue<T>(obj: T): obj is WithValue<T> {
  return Object.prototype.hasOwnProperty.call(obj, "value");
}

export type WithName<T> = Extract<T, { name?: string }>;

export function hasName<T>(obj: T): obj is WithName<T> {
  return Object.prototype.hasOwnProperty.call(obj, "name");
}

export type WithDescription<T> = Extract<T, { description: string }>;

export function hasDescription<T>(obj: T): obj is WithDescription<T> {
  return Object.prototype.hasOwnProperty.call(obj, "description");
}

export type WithExtra<T> = Extract<T, { extra?: string }>;

export function hasExtra<T>(obj: T): obj is WithExtra<T> {
  return Object.prototype.hasOwnProperty.call(obj, "extra");
}

/**
 * Computes a simple hash of a string.
 * @param s The string to hash
 * @returns The hash
 * @see https://stackoverflow.com/a/52171480
 */
export function simpleHash(s: string): string {
  let h = 9;
  for (let i = 0; i < s.length; ) {
    h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
  }

  const hash = h ^ (h >>> 9);
  return (hash >>> 0).toString(16);
}
