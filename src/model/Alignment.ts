import { z } from "zod";
import { ICodedModelSchema } from "./ICodedModel";

export const AlignmentIdSchema = z.enum(["lg", "ng", "cg", "ln", "n", "cn", "le", "ne", "ce"]);

export const AlignmentSchema = ICodedModelSchema.extend({
  id: AlignmentIdSchema,
});

export type Alignment = z.infer<typeof AlignmentSchema>;

export const AlignmentIds = AlignmentIdSchema.enum;

export function isAlignment(obj: unknown): obj is Alignment {
  return AlignmentSchema.safeParse(obj).success;
}
