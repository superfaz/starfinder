import Col from "react-bootstrap/Col";
import { DroneDefinition } from "./DroneDefinition";
import { DroneSheetOne, DroneSheetThree, DroneSheetTwo } from "./DroneSheet";

export function PageContent() {
  return (
    <>
      <Col xs={12} sm={6} md={4} lg={3} xl={2} className="mb-3">
        <DroneDefinition />
      </Col>
      <Col xs={12} sm={6} md={4} lg={3} xl={2} className="mb-3">
        <DroneSheetOne />
      </Col>
      <Col xs={12} sm={6} md={4} lg={3} xl={2} className="mb-3">
        <DroneSheetTwo />
      </Col>
      <Col xs={12} sm={6} md={4} lg={3} xl={2} className="mb-3">
        <DroneSheetThree />
      </Col>
    </>
  );
}
