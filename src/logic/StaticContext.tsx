import { Size } from "model";
import { createContext, useContext } from "react";

export interface IStaticData {
  sizes: Size[];
}

const EmptyContext: IStaticData = {
  sizes: [],
};

export const StaticContext = createContext<IStaticData>(EmptyContext);

export function useStaticData(): IStaticData {
  return useContext(StaticContext);
}
