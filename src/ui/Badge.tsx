import clsx from "clsx";
import { ReactNode } from "react";

export function Badge({
  children,
  bg,
  className,
  ...props
}: Readonly<{ children: ReactNode; bg: string; className?: string }>): JSX.Element {
  return (
    <span className={clsx("badge", bg && `bg-${bg}`, className)} {...props}>
      <span className="content">{children}</span>
    </span>
  );
}
