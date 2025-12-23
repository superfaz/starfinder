import { CharacterPresenter } from "logic";

interface ICharacterProps {
  presenter: CharacterPresenter;
}

export type CharacterProps = Readonly<ICharacterProps>;
