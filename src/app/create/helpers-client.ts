import { useEffect, useMemo } from "react";
import { CharacterPresenter, DronePresenter, retrieveClassDetails, useAppDispatch, useAppSelector } from "logic";
import type { ClassMechanic, IModel } from "model";

export function useCharacterPresenter() {
  const data = useAppSelector((state) => state.data);
  const character = useAppSelector((state) => state.character);
  const classesDetails = useAppSelector((state) => state.classesDetails);
  return useMemo(() => new CharacterPresenter(data, classesDetails, character), [data, classesDetails, character]);
}

export function useClassDetails<T extends IModel>(classId: string): T | undefined {
  const classDetails = useAppSelector((state) => state.classesDetails[classId]) as T | undefined;
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails(classId));
    }
  }, [dispatch, classDetails, classId]);

  return classDetails;
}

export function useDronePresenter() {
  const parent = useCharacterPresenter();
  const data = useAppSelector((state) => state.data);
  const classDetails = useClassDetails<ClassMechanic>("mechanic");

  return useMemo(() => {
    console.log("useDronePresenter useMemo", classDetails);
    if (classDetails === undefined) {
      return undefined;
    } else {
      return new DronePresenter(parent, data, classDetails);
    }
  }, [parent, data, classDetails]);
}
