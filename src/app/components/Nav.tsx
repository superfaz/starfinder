import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  startsWith = false,
  disabled,
}: {
  children: ReactNode;
  href: string;
  startsWith?: boolean;
  disabled?: boolean;
}) {
  const pathname = usePathname();
  const isActive = startsWith ? pathname && pathname.startsWith(href) : pathname === href;

  return (
    <Link href={href} className={clsx("nav-link", isActive && "active", disabled && "disabled")}>
      {children}
    </Link>
  );
}

Nav.Item = NavItem;
Nav.Link = NavLink;

export { Nav };
