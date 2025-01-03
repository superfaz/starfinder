import { AbilityScore, Variant } from "model";
import { OriginView } from "view";

export interface State {
  origin?: OriginView;
  variant?: Variant;
  selectableBonus?: AbilityScore;
  selectedTraits: string[];
  options?: unknown;
}
