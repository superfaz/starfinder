import { z } from "zod";
import { INamedModel } from "./INamedModel";

export const ChapterSchema = INamedModel.extend({
  number: z.number(),
  start: z.number(),
  end: z.number(),
});

export type Chapter = z.infer<typeof ChapterSchema>;

export const BookSchema = INamedModel.extend({
  chapters: z.array(ChapterSchema),
});

export type Book = z.infer<typeof BookSchema>;
