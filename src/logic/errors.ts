/**
 * This file contains custom error classes that can be thrown by the logic layer.
 */

export class DataSourceError extends Error {
  private _tag = "DataSourceError";
}

export class UnauthorizedError extends Error {
  private _tag = "UnauthorizedError";
}

export class ParsingError extends Error {
  private _tag = "ParsingError";
  constructor(readonly errors: Record<string, string[] | undefined>) {
    super();
  }
}

export class NotFoundError extends Error {
  private _tag = "NotFoundError";
}

export class NotSingleError extends Error {
  private _tag = "NotSingleError";
}

export class InvalidError extends Error {
  private _tag = "InvalidError";
}
