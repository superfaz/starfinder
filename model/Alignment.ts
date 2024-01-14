import { z } from "zod";
import { ICodedModel } from "./ICodedModel";

export const Alignment = ICodedModel.extend({
  //TODO: id: z.enum(["lg", "ng", "cg", "ln", "n", "cn", "le", "ne", "ce"]),
});

export type Alignment = z.infer<typeof Alignment>;

export function isAlignment(obj: unknown): obj is Alignment {
  return Alignment.safeParse(obj).success;
}
