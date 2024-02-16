import { z } from "zod";
import { IModel } from "./IModel";

export const INamedModel = IModel.extend({
  name: z.string(),
});

export type INamedModel = z.infer<typeof INamedModel>;

export function isNamedModel(obj: unknown): obj is INamedModel {
  return INamedModel.safeParse(obj).success;
}
