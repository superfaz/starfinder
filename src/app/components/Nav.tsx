import { clsx } from "clsx";
import { ReactNode } from "react";

function Nav({
  children,
  variant,
  className,
  ...props
}: Readonly<{ children: ReactNode; variant?: "tabs" | "pills" | "underline"; className?: string }>) {
  return (
    <nav className={clsx("nav", className, variant && `nav-${variant}`)} {...props}>
      {children}
    </nav>
  );
}

function NavItem({ children, className, ...props }: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <div className={clsx("nav-item", className)} {...props}>
      {children}
    </div>
  );
}

Nav.Item = NavItem;

export { Nav };
