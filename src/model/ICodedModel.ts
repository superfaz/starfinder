import { z } from "zod";
import { IModelSchema } from "./IModel";

export const ICodedModelSchema = IModelSchema.extend({
  code: z.string(),
  name: z.string(),
});

export type ICodedModel = z.infer<typeof ICodedModelSchema>;

export function isCodedModel(obj: unknown): obj is ICodedModel {
  return ICodedModelSchema.safeParse(obj).success;
}
