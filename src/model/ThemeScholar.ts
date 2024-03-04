import { z } from "zod";
import { IModelSchema } from "./IModel";

export const ThemeScholar = IModelSchema.extend({
  values: z.record(z.array(z.string())),
});

export type ThemeScholar = z.infer<typeof ThemeScholar>;

export function isThemeScholar(obj: unknown): obj is ThemeScholar {
  return ThemeScholar.safeParse(obj).success;
}
