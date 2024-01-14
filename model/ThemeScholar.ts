import { z } from "zod";
import { IModel } from "./IModel";

export const ThemeScholar = IModel.extend({
  values: z.record(z.array(z.string())),
});

export type ThemeScholar = z.infer<typeof ThemeScholar>;

export function isThemeScholar(obj: unknown): obj is ThemeScholar {
  return ThemeScholar.safeParse(obj).success;
}
