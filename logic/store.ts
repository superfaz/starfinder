import { configureStore, createAsyncThunk, createReducer, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { IClientDataSet } from "data";
import { IModel } from "model";

function createDataReducer(data: IClientDataSet) {
  return createReducer(data, () => {});
}

/**
 * Redux action to retrieve class details using the API.
 * @param classId The ID of the class to retrieve.
 */
export const retrieveClassDetails = createAsyncThunk<IModel, string>("classesDetails/retrieve", async (classId) => {
  const response = await fetch(`/api/classes/${classId}/details`);
  const data = await response.json();
  return data as IModel;
});

function createClassesDetailsSlice() {
  return createSlice({
    name: "classesDetails",
    initialState: {} as Record<string, IModel>,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(retrieveClassDetails.fulfilled, (state, action) => {
        return { ...state, [action.meta.arg]: action.payload };
      });
    },
  });
}

export function makeStore(data: IClientDataSet) {
  return configureStore({
    reducer: {
      data: createDataReducer(data),
      classesDetails: createClassesDetailsSlice().reducer,
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
