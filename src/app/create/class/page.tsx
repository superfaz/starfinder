import { Col } from "react-bootstrap";
import { ClassSelection } from "./ClassSelection";
import { ClassDetails } from "./ClassDetails";

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
