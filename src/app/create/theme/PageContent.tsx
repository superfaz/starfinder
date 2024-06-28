import Col from "react-bootstrap/Col";
import { ThemeSelection } from "./ThemeSelection";
import { ThemeTraits } from "./ThemeTraits";

export function PageContent() {
  return (
    <>
      <Col lg={3}>
        <ThemeSelection />
      </Col>
      <Col>
        <ThemeTraits />
      </Col>
    </>
  );
}
