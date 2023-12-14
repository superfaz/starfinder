import { DataSet } from "data";
import { CharacterMutators, CharacterPresenter } from "logic";

/**
 * Base props for standard character tabs.
 */
export interface CharacterTabProps {
  data: DataSet;
  character: CharacterPresenter;
  mutators: CharacterMutators;
}
