import { z } from "zod";
import { type IEntry, IEntrySchema, RaceModifierSchema } from "model";

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
  race?: IEntry;
  theme?: IEntry;
  class?: IEntry;
  level?: number;
}

const labels = {
  core: "Standard",
  legacy: "Héritage",
  other: "Autre",
};

export const RaceEntrySchema = IEntrySchema.extend({
  category: z.enum(["core", "legacy", "other"]).transform((v) => labels[v]),
  modifiers: z.array(RaceModifierSchema),
});

export type RaceEntry = z.infer<typeof RaceEntrySchema>;
