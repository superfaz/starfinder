import { z } from "zod";

export const Prerequisite = z.object({});

export type Prerequisite = z.infer<typeof Prerequisite>;

export function isPrerequisite(data: unknown): data is Prerequisite {
  return Prerequisite.safeParse(data).success;
}
