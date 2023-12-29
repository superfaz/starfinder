import { IDataSet } from "data";
import { CharacterMutators, CharacterPresenter } from "logic";

interface ICharacterProps {
  character: CharacterPresenter;
}

interface ISimpleEditProps {
  character: CharacterPresenter;
  mutators: CharacterMutators;
}

/**
 * Base props for standard character tabs with editing capabilities.
 */
interface ITabEditProps {
  data: IDataSet;
  character: CharacterPresenter;
  mutators: CharacterMutators;
}

export type CharacterProps = Readonly<ICharacterProps>;
export type SimpleEditProps = Readonly<ISimpleEditProps>;
export type TabEditProps = Readonly<ITabEditProps>;
