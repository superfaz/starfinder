import { z } from "zod";

export const IModel = z.object({
  id: z.union([z.string().regex(/^[a-z][a-z0-9-]*[a-z0-9]$/), z.string().uuid()]),
});

export type IModel = z.infer<typeof IModel>;

export function isIModel(obj: unknown): obj is IModel {
  return IModel.safeParse(obj).success;
}

export function asIModel(obj: unknown): IModel {
  return IModel.parse(obj);
}
