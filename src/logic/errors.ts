/**
 * This file contains custom error classes that can be thrown by the logic layer.
 */

export class DataSourceError extends Error {
  private _tag = "DataSourceError";
}

export class UnauthorizedError extends Error {
  private _tag = "UnauthorizedError";
}

export type ParsingError = {
  _tag: "ParsingError";
  errors: Record<string, string[] | undefined>;
};

export function isParsingError(error: unknown): error is ParsingError {
  return !!error && typeof error === "object" && "_tag" in error && error._tag === "ParsingError";
}

export function createParsingError(errors: Record<string, string[] | undefined>): ParsingError {
  return { _tag: "ParsingError", errors };
}

export class NotFoundError extends Error {
  private _tag = "NotFoundError";
  constructor(
    public readonly type: string,
    public readonly id: string
  ) {
    super(`Not found: ${type} with id ${id}`);
  }
}

export class NotSingleError extends Error {
  private _tag = "NotSingleError";
}

export class InvalidError extends Error {
  private _tag = "InvalidError";
}

export class ThemeNotSetError extends Error {
  private _tag = "ThemeNotSetError";
}
