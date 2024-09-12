import { clsx } from "clsx";
import Link from "next/link";
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

function NavLink({
  children,
  href,
  className,
  active,
  disabled,
  onClick,
}: Readonly<{
  children: ReactNode;
  href: string;
  className?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}>) {
  return (
    <Link
      href={href}
      className={clsx("nav-link", className, active && "active", disabled && "disabled")}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

Nav.Item = NavItem;
Nav.Link = NavLink;

export { Nav };
