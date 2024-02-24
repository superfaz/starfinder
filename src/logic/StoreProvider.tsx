"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
import { IClientDataSet } from "data";
import { mutators } from "./slice-create";

export type StoreProviderProps = Readonly<{ data: IClientDataSet; children: React.ReactNode }>;

/**
 * Encapsulates the Redux store and provides it to the application.
 *
 * @param data The data set to initialize the store with.
 * @param children The application to render.
 * @returns The application wrapped in a Redux store.
 * @see https://redux-toolkit.js.org/usage/nextjs
 */
export default function StoreProvider({ data, children }: StoreProviderProps) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    storeRef.current.dispatch(mutators.initializeData(data));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
