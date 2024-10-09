import { convert, PromisedResult } from "chain-of-actions";
import { ZodError, ZodType, ZodTypeDef } from "zod";
import { ParsingError } from "../errors";

export function parse<T, D extends ZodTypeDef, I>(
  schema: ZodType<T, D, I>,
  data: unknown
): PromisedResult<T, ParsingError> {
  return convert({
    try: async () => schema.parse(data),
    catch: (error) => {
      if (error instanceof ZodError) {
        return new ParsingError(error.flatten().fieldErrors);
      } else {
        throw error;
      }
    },
  });
}
