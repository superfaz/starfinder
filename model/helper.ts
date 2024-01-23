import { z } from "zod";

export const Description = z.string().regex(/^[\p{Lu}0-9+-].+\.$/u);
