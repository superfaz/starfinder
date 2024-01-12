import { CharacterPresenter } from "logic";

interface ICharacterProps {
  character: CharacterPresenter;
}

export type CharacterProps = Readonly<ICharacterProps>;
