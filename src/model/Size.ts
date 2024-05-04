import { z } from "zod";
import { ICodedModelSchema } from "./ICodedModel";

export const SizeIdSchema = z.enum([
  "fine",
  "diminutive",
  "tiny",
  "small",
  "medium",
  "large",
  "huge",
  "gargantuan",
  "colossal",
]);

export type SizeId = z.infer<typeof SizeIdSchema>;

export const SizeSchema = ICodedModelSchema.extend({
  id: SizeIdSchema,
});

export type Size = z.infer<typeof SizeSchema>;

export function isSize(obj: unknown): obj is Size {
  return SizeSchema.safeParse(obj).success;
}
