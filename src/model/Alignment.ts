import { z } from "zod";
import { ICodedModelSchema } from "./ICodedModel";

export const AlignmentIdSchema = z.enum(["lg", "ng", "cg", "ln", "n", "cn", "le", "ne", "ce"]);

export const Moralities = ["good", "neutral", "evil"] as const;
export const MoralitySchema = z.enum(Moralities);

export const Ethics = ["lawful", "neutral", "chaotic"] as const;
export const EthicSchema = z.enum(Ethics);

export const AlignmentSchema = ICodedModelSchema.extend({
  id: AlignmentIdSchema,
  morality: MoralitySchema,
  ethic: EthicSchema,
});

export type Alignment = z.infer<typeof AlignmentSchema>;

export const AlignmentIds = AlignmentIdSchema.enum;

export function isAlignment(obj: unknown): obj is Alignment {
  return AlignmentSchema.safeParse(obj).success;
}
