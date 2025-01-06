import { z } from "zod";
import type { BonusCategoryId } from "./BonusCategory";

export const IdSchema = z.union([z.string().regex(/^([a-z]|[a-z][a-z0-9-]*[a-z0-9])$/), z.string().uuid()]);

export const VariableSchema = z.string().regex(/^<[a-z][a-zA-Z]+>$/);

export const DescriptionSchema = z.union([VariableSchema, z.string().regex(/^[\p{Lu}0-9+-].+\.$/u)]);

export const LevelSchema = z.number().int().min(0).max(20);

export const ReferenceSchema = z.object({
  book: z.string(),
  page: z.number().positive(),
});

export type Reference = z.infer<typeof ReferenceSchema>;

export const EvolutionsSchema = z.record(
  z.string().regex(/\d+/),
  z.union([z.null(), z.record(z.union([z.number(), z.string()]))])
);

export function isVariable(value: string): boolean {
  return VariableSchema.safeParse(value).success;
}

type WithValue<T> = Extract<T, { value: number }>;

export function hasValue<T>(obj: T): obj is WithValue<T> {
  return Object.prototype.hasOwnProperty.call(obj, "value");
}

type WithTarget<T> = Extract<T, { target?: string }>;

export function hasTarget<T>(obj: T): obj is WithTarget<T> {
  return Object.prototype.hasOwnProperty.call(obj, "target");
}

type WithName<T> = Extract<T, { name?: string }>;

export function hasName<T>(obj: T): obj is WithName<T> {
  return Object.prototype.hasOwnProperty.call(obj, "name");
}

interface WithDescription {
  description: string;
}

export function hasDescription(obj: object): obj is WithDescription {
  return Object.prototype.hasOwnProperty.call(obj, "description");
}

interface WithCategory {
  category: BonusCategoryId;
}

export function hasCategory(obj: object): obj is WithCategory {
  return Object.prototype.hasOwnProperty.call(obj, "category");
}

type WithExtra<T> = Extract<T, { extra?: string }>;

export function hasExtra<T>(obj: T): obj is WithExtra<T> {
  return Object.prototype.hasOwnProperty.call(obj, "extra");
}

/**
 * Computes a simple hash of a string.
 * @param s - the string to hash
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
