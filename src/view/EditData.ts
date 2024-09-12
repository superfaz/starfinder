import { IdSchema } from "model";
import { z } from "zod";

export const EditStepSchema = z.object({
  action: z.enum(["edit"]),
  field: z.string(),
  value: z.unknown(),
});

export type EditStep = z.infer<typeof EditStepSchema>;

export const EditDataSchema = z.object({
  id: IdSchema,
  steps: z.array(EditStepSchema),
});

export type EditData = z.infer<typeof EditDataSchema>;
