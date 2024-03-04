import { z } from "zod";
import { IModelSchema } from "./IModel";

export const ThemeScholarSchema = IModelSchema.extend({
  values: z.record(z.array(z.string())),
});

export type ThemeScholar = z.infer<typeof ThemeScholarSchema>;

export function isThemeScholar(obj: unknown): obj is ThemeScholar {
  return ThemeScholarSchema.safeParse(obj).success;
}
