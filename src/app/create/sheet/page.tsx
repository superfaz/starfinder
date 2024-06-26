import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { PageClient } from "./PageClient";

export const metadata: Metadata = {
  title: "Fiche de personnage",
};

export default function Page() {
  return (
    <Col lg={12}>
      <PageClient />
    </Col>
  );
}
