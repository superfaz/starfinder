import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { SpellsSelection } from "./SpellsSelection";

export const metadata: Metadata = {
  title: "Sélection des sorts",
};

export default function Page() {
  return (
    <Col lg={12}>
      <SpellsSelection />
    </Col>
  );
}
