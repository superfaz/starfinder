import { DataSet } from "data";
import { CharacterMutators, CharacterPresenter } from "logic";

/**
 * Base props for standard character tabs with editing capabilities.
 */
export interface TabEditProps {
  data: DataSet;
  character: CharacterPresenter;
  mutators: CharacterMutators;
}
