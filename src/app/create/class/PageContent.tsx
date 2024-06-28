import Col from "react-bootstrap/Col";
import { ClassSelection } from "./ClassSelection";
import { ClassDetails } from "./ClassDetails";

export function PageContent() {
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
