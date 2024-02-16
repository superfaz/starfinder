import { z } from "zod";
import { IModel } from "./IModel";

export const ICodedModel = IModel.extend({
  code: z.string(),
  name: z.string(),
});

export type ICodedModel = z.infer<typeof ICodedModel>;

export function isCodedModel(obj: unknown): obj is ICodedModel {
  return ICodedModel.safeParse(obj).success;
}
