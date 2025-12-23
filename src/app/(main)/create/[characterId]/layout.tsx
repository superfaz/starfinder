import { ReactNode } from "react";
import { Container } from "react-bootstrap";

export default function Layout({ children }: { children: ReactNode }) {
  return <Container>{children}</Container>;
}
