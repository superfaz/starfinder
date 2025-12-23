import { z } from "zod";

export const TemplateEquipmentSchema = z.record(z.unknown());

export type TemplateEquipment = z.infer<typeof TemplateEquipmentSchema>;
