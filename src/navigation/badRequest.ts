export class BadRequestError extends Error {
  private _tag = "BadRequestError";
  constructor() {
    super("Bad Request");
  }
}

export function badRequest(): never {
  throw new BadRequestError();
}
