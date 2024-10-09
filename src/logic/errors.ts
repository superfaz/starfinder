/**
 * This file contains custom error classes that can be thrown by the logic layer.
 */

export class DataSourceError extends Error {}

export class UnauthorizedError extends Error {}

export class ParsingError extends Error {
  constructor(readonly errors: Record<string, string[] | undefined>) {
    super();
  }
}
