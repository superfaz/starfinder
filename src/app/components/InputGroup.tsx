import { ReactNode } from "react";

export function InputGroup({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return <div className="input-group">{children}</div>;
}
