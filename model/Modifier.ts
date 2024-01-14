import { z } from "zod";
import { IModel } from "./IModel";
import { ModifierType } from "./ModifierType";

export const Modifier = IModel.extend({
  type: ModifierType,
  level: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  target: z.string().optional(),
  value: z.number().optional(),
}).strict();

export type Modifier = z.infer<typeof Modifier>;

export function isModifier(obj: unknown): obj is Modifier {
  return Modifier.safeParse(obj).success;
}
