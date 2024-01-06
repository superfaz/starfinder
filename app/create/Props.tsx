import { CharacterMutators, CharacterPresenter } from "logic";

interface ICharacterProps {
  character: CharacterPresenter;
}

interface ISimpleEditProps {
  character: CharacterPresenter;
  mutators: CharacterMutators;
}

export type CharacterProps = Readonly<ICharacterProps>;
export type SimpleEditProps = Readonly<ISimpleEditProps>;
