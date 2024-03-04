import { z } from "zod";
import { IModel } from "./IModel";

export const AvatarSchema = IModel.extend({
  image: z.string(),
  tags: z.array(z.string()),
});

export type Avatar = z.infer<typeof AvatarSchema>;

export function isAvatar(data: unknown): data is Avatar {
  return AvatarSchema.safeParse(data).success;
}
