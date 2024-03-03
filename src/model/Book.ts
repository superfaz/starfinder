import { z } from "zod";
import { ICodedModel } from "./ICodedModel";
import { INamedModel } from "./INamedModel";

export const Chapter = INamedModel.extend({
  number: z.number(),
  start: z.number(),
  end: z.number(),
});

export type Chapter = z.infer<typeof Chapter>;

export const Book = ICodedModel.extend({
  chapters: z.array(Chapter),
});

export type Book = z.infer<typeof Book>;
