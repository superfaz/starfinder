import { Book, Size } from "model";
import { createContext, useContext } from "react";

export interface IStaticData {
  sizes: Size[];
  books: Book[];
}

const EmptyContext: IStaticData = {
  sizes: [],
  books: [],
};

export const StaticContext = createContext<IStaticData>(EmptyContext);

export function useStaticData(): IStaticData {
  return useContext(StaticContext);
}
