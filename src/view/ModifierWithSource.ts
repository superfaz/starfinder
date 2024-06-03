import { INamedModel, Modifier } from "model";

export type ModifierWithSource = Modifier & { source: INamedModel };
