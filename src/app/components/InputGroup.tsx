import { ReactNode } from "react";

export function InputGroup({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  return <div className="input-group">{children}</div>;
}
