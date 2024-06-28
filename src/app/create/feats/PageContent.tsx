import Col from "react-bootstrap/Col";
import { FeatsInherited } from "./FeatsInherited";
import { FeatsSelected } from "./FeatsSelected";
import { FeatsSelection } from "./FeatsSelection";

export function PageContent() {
  return (
    <>
      <Col lg={3}>
        <FeatsInherited />
        <FeatsSelected />
      </Col>
      <Col>
        <FeatsSelection />
      </Col>
    </>
  );
}
