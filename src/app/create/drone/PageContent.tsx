import Col from "react-bootstrap/Col";
import { DroneDefinition } from "./DroneDefinition";
import { DroneSheetOne, DroneSheetTwo } from "./DroneSheet";

export function PageContent() {
  return (
    <>
      <Col lg={3}>
        <DroneDefinition />
      </Col>
      <Col lg={3}>
        <DroneSheetOne />
      </Col>
      <Col lg={3}>
        <DroneSheetTwo />
      </Col>
      <Col></Col>
    </>
  );
}
