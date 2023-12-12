import { Feature, SecondaryTrait, Variant } from ".";

export interface Race {
  id: string;
  name: string;
  description: string;
  refs: string[];
  hitPoints: number;
  variants: Variant[];
  names: string[];
  traits: Feature[];
  secondaryTraits: SecondaryTrait[];
}
