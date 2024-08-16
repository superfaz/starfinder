import Col from "react-bootstrap/Col";
import { ClassSelection } from "./ClassSelection";
import { ClassDetails } from "./ClassDetails";

export function PageContent() {
  return (
    <>
      <Col xs={12} sm={6} md={4} lg={3} xl={2}>
        <ClassSelection />
      </Col>
      <Col>
        <ClassDetails />
      </Col>
    </>
  );
}
