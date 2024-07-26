import Col from "react-bootstrap/Col";
import { ChassisSelection } from "./ChassisSelection";
import { DroneSheetOne, DroneSheetTwo } from "./DroneSheet";

export function PageContent() {
  return (
    <>
      <Col lg={3}>
        <ChassisSelection />
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
