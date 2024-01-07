import { configureStore, createReducer } from "@reduxjs/toolkit";
import { IClientDataSet } from "data";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

function createDataReducer(data: IClientDataSet) {
  return createReducer(data, () => {});
}

export function makeStore(data: IClientDataSet) {
  return configureStore({
    reducer: {
      data: createDataReducer(data),
    },
  });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
