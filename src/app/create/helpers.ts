import { CharacterPresenter, useAppSelector } from "logic";
import { useMemo } from "react";

export function useCharacterPresenter() {
  const data = useAppSelector((state) => state.data);
  const character = useAppSelector((state) => state.character);
  const classesDetails = useAppSelector((state) => state.classesDetails);
  return useMemo(() => new CharacterPresenter(data, classesDetails, character), [data, classesDetails, character]);
}
