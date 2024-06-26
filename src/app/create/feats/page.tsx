import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { FeatsInherited } from "./FeatsInherited";
import { FeatsSelected } from "./FeatsSelected";
import { FeatsSelection } from "./FeatsSelection";

export const metadata: Metadata = {
  title: "Sélection des dons",
};

export default function Page() {
  return (
    <>
      <Col lg={3}>
        <FeatsInherited />
        <FeatsSelected />
      </Col>
      <Col>
        <FeatsSelection />
      </Col>
    </>
  );
}
