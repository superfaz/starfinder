import { UnauthorizedError } from "logic";

export function unauthorized(): never {
  throw new UnauthorizedError();
}
