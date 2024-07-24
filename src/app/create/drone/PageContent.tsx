import Col from "react-bootstrap/Col";
import { ChassisSelection } from "./ChassisSelection";
import { FeatureSelection } from "./FeatureSelection";
import { ModSelection } from "./ModSelection";

export function PageContent() {
  return (
    <>
      <Col lg={3}>
        <ChassisSelection />
      </Col>
      <Col>
        <FeatureSelection />
      </Col>
      <Col>
        <ModSelection />
      </Col>
    </>
  );
}
