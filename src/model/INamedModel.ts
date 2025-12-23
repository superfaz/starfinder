import { z } from "zod";
import { IModelSchema } from "./IModel";

export const INamedModelSchema = IModelSchema.extend({
  name: z.string(),
});

export type INamedModel = z.infer<typeof INamedModelSchema>;

export function isNamedModel(obj: unknown): obj is INamedModel {
  return INamedModelSchema.safeParse(obj).success;
}
