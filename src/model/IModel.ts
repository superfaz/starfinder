import { z } from "zod";

export const IModelSchema = z.object({
  id: z.union([z.string().regex(/^([a-z]|[a-z][a-z0-9-]*[a-z0-9])$/), z.string().uuid()]),
});

export type IModel = z.infer<typeof IModelSchema>;

export function isIModel(obj: unknown): obj is IModel {
  return IModelSchema.safeParse(obj).success;
}

export function asIModel(obj: unknown): IModel {
  return IModelSchema.parse(obj);
}
