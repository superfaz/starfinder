import { z } from "zod";

export const Id = z.union([z.string().regex(/^([a-z]|[a-z][a-z0-9-]*[a-z0-9])$/), z.string().uuid()]);

export const Description = z.string().regex(/^[\p{Lu}0-9+-].+\.$/u);

export const Variable = z.string().regex(/^<[a-z][a-zA-Z]+>$/);
