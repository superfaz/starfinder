import clsx from "clsx";
import React, { ReactNode } from "react";

function Card({ children, className, ...props }: Readonly<{ children: ReactNode; className?: string }>) {
  return React.createElement("div", { ...props, className: clsx("card", className) }, children);
}

function CardBody({ children, className, ...props }: Readonly<{ children?: ReactNode; className?: string }>) {
  return React.createElement("div", { ...props, className: clsx("card-body", className) }, children);
}

function CardFooter({ children, className, ...props }: Readonly<{ children: ReactNode; className?: string }>) {
  return React.createElement("div", { ...props, className: clsx("card-footer", className) }, children);
}

function CardHeader({ children, className, ...props }: Readonly<{ children: ReactNode; className?: string }>) {
  return React.createElement("div", { ...props, className: clsx("card-header", className) }, children);
}

function CardText({
  children,
  as = "p",
  className,
  ...props
}: Readonly<{ children: ReactNode; as?: "div" | "p"; className?: string }>) {
  return React.createElement(as, { ...props, className: clsx("card-text", className) }, children);
}

function CardTitle({
  children,
  as = "h5",
  className,
  ...props
}: Readonly<{ children: ReactNode; as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5"; className?: string }>) {
  return React.createElement(as, { ...props, className: clsx("card-title", className) }, children);
}

Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Header = CardHeader;
Card.Text = CardText;
Card.Title = CardTitle;

export { Card };
