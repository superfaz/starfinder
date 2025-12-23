import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const BodyPartIdSchema = z.enum([
  "arm",
  "brain",
  "ears",
  "eyes",
  "foot",
  "hand",
  "heart",
  "leg",
  "lungs",
  "column",
  "skin",
  "throat",
]);

export type BodyPartId = z.infer<typeof BodyPartIdSchema>;

export const BodyPartSchema = INamedModelSchema.extend({
  id: BodyPartIdSchema,
  default: z.number().int().positive(),
});

export type BodyPart = z.infer<typeof BodyPartSchema>;
