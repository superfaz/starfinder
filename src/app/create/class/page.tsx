import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { ClassSelection } from "./ClassSelection";
import { ClassDetails } from "./ClassDetails";

export const metadata: Metadata = {
  title: "Sélection de la classe",
};

export default function Page() {
  return (
    <>
      <Col lg={3}>
        <ClassSelection />
      </Col>
      <Col>
        <ClassDetails />
      </Col>
    </>
  );
}
