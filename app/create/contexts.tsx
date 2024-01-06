import { IClientDataSet } from "data";
import { createContext } from "react";

export const DataContext = createContext<Readonly<IClientDataSet | null>>(null);
