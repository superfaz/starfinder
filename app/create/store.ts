import { configureStore, createAsyncThunk, createReducer, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { IClientDataSet } from "data";
import { ClassOperative } from "model";

function createDataReducer(data: IClientDataSet) {
  return createReducer(data, () => {});
}

export const retrieveClassDetails = createAsyncThunk<ClassOperative, string>(
  "classDetails/retrieve",
  async (classId) => {
    const response = await fetch(`/api/classes/${classId}/details`);
    const data = await response.json();
    return data as ClassOperative;
  }
);

function createClassDetailsSlice() {
  return createSlice({
    name: "classDetails",
    initialState: {} as Record<string, ClassOperative>,
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
      classDetails: createClassDetailsSlice().reducer,
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
