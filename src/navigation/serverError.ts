class TechnicalError extends Error {
  private _tag = "TechnicalError";
  constructor(public readonly cause: Error) {
    super("Technical error");
  }
}

export function serverError(error?: Error): never {
  if (error) {
    throw new TechnicalError(error);
  } else {
    throw new TechnicalError(new Error("An unexpected error occurs"));
  }
}
