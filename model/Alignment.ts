import { z } from "zod";
import { ICodedModel } from "./ICodedModel";

const AlignmentId = z.enum(["lg", "ng", "cg", "ln", "n", "cn", "le", "ne", "ce"]);

export const Alignment = ICodedModel.extend({
  id: AlignmentId,
});

export type Alignment = z.infer<typeof Alignment>;

export const AlignmentIds = AlignmentId.enum;

export function isAlignment(obj: unknown): obj is Alignment {
  return Alignment.safeParse(obj).success;
}
