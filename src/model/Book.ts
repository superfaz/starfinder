import { z } from "zod";
import { INamedModelSchema } from "./INamedModel";

export const ChapterSchema = INamedModelSchema.extend({
  number: z.number(),
  start: z.number(),
  end: z.number(),
});

export type Chapter = z.infer<typeof ChapterSchema>;

export const BookSchema = INamedModelSchema.extend({
  chapters: z.array(ChapterSchema),
});

export type Book = z.infer<typeof BookSchema>;
