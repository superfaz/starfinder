class TechnicalError extends Error {
  private _tag = "TechnicalError";
  constructor(public readonly cause: Error) {
    super("Technical error");
  }
}

export function serverError(error: Error): never {
  throw new TechnicalError(error);
}
