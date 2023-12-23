import { Container } from "react-bootstrap";

export default function CreateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Container style={{ width: "1600px", minWidth: "1600px" }}>{children}</Container>;
}
