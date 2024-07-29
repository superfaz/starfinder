import Col from "react-bootstrap/Col";
import { FeatsInherited } from "./FeatsInherited";
import { FeatsSelected } from "./FeatsSelected";
import { FeatsSelection } from "./FeatsSelection";

export function PageContent() {
  return (
    <>
      <Col xs={12} sm={6} md={4} lg={3} xl={2}>
        <FeatsInherited />
        <FeatsSelected />
      </Col>
      <Col>
        <FeatsSelection />
      </Col>
    </>
  );
}
