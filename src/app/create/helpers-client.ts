import { useMemo } from "react";
import { CharacterPresenter, useAppSelector } from "logic";

export function useCharacterPresenter() {
  const data = useAppSelector((state) => state.data);
  const character = useAppSelector((state) => state.character);
  const classesDetails = useAppSelector((state) => state.classesDetails);
  return useMemo(() => new CharacterPresenter(data, classesDetails, character), [data, classesDetails, character]);
}
