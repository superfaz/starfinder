import Col from "react-bootstrap/Col";
import { ChassisSelection } from "./ChassisSelection";
import { FeatureSelection } from "./FeatureSelection";
import { ModSelection } from "./ModSelection";

export function PageContent() {
  return (
    <>
      <Col lg={4}>
        <ChassisSelection />
      </Col>
      <Col lg={4}>
        <FeatureSelection />
      </Col>
      <Col lg={4}>
        <ModSelection />
      </Col>
    </>
  );
}
