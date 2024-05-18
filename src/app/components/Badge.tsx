import clsx from "clsx";
import { ReactNode } from "react";

export function Badge({
  children,
  bg,
  className,
  ...props
}: Readonly<{ children: ReactNode; bg: string; className?: string }>): JSX.Element {
  return (
    <div className={clsx("badge", bg && `bg-${bg}`, className)} {...props}>
      <div className="content">{children}</div>
    </div>
  );
}
