import { useMemo } from "react";
import { CharacterPresenter, DronePresenter, useAppSelector } from "logic";
import type { ClassMechanic, IModel } from "model";

export function useCharacterPresenter() {
  const data = useAppSelector((state) => state.data);
  const character = useAppSelector((state) => state.character);
  const classesDetails = useAppSelector((state) => state.classesDetails);
  return useMemo(() => new CharacterPresenter(data, classesDetails, character), [data, classesDetails, character]);
}

export function useClassDetails<T extends IModel>(classId: string): T | undefined {
  return useAppSelector((state) => state.classesDetails[classId]) as T | undefined;
}

export function useDronePresenter() {
  const classDetails = useClassDetails<ClassMechanic>("mechanic");
  const parent = useCharacterPresenter();

  return useMemo(() => {
    if (classDetails === undefined) {
      return undefined;
    } else {
      return new DronePresenter(parent, classDetails);
    }
  }, [parent, classDetails]);
}
