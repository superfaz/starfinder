import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const ICodedModelSchema = INamedModelSchema.extend({
  code: z.string(),
});

export type ICodedModel = z.infer<typeof ICodedModelSchema>;

export function isCodedModel(obj: unknown): obj is ICodedModel {
  return ICodedModelSchema.safeParse(obj).success;
}
