"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
import { IClientDataSet } from "data";
import { mutators } from "./slice-create";
import { Character, IModel } from "model";

type StoreProviderProps = Readonly<{
  data: IClientDataSet;
  character?: Character;
  classesDetails?: Record<string, IModel>;
  children: React.ReactNode;
}>;

/**
 * Encapsulates the Redux store and provides it to the application.
 *
 * @param data - the data set to initialize the store with
 * @param children - the application to render
 * @returns The application wrapped in a Redux store
 * @see https://redux-toolkit.js.org/usage/nextjs
 */
export default function StoreProvider({ data, character, classesDetails, children }: StoreProviderProps) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    storeRef.current.dispatch(mutators.initializeData(data));
    if (character) {
      storeRef.current.dispatch(mutators.initializeCharacter(character));
    }
    if (classesDetails) {
      storeRef.current.dispatch(mutators.initializeClassesDetails(classesDetails));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
