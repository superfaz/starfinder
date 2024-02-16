import { z } from "zod";
import { IModel } from "./IModel";

export const Avatar = IModel.extend({
  image: z.string(),
  tags: z.array(z.string()),
});

export type Avatar = z.infer<typeof Avatar>;

export function isAvatar(data: unknown): data is Avatar {
  return Avatar.safeParse(data).success;
}
