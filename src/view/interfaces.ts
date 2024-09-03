import { z } from "zod";
import { IEntrySchema } from "model";

export interface CharacterView {
  id: string;
  name: string;
  avatar?: string;
  race?: string;
  theme?: string;
  class?: string;
  level?: number;
}

export interface CharacterDetailedView {
  id: string;
  name: string;
  avatar?: string;
  race?: string;
  theme?: string;
  class?: string;
  level?: number;
}

const labels = {
  core: "Standard",
  legacy: "Héritage",
  other: "Autre",
};

export const RaceEntrySchema = IEntrySchema.extend({
  category: z.enum(["core", "legacy", "other"]).transform((v) => labels[v]),
});

export type RaceEntry = z.infer<typeof RaceEntrySchema>;
