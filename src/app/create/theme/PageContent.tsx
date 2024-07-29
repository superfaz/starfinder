import Col from "react-bootstrap/Col";
import { ThemeSelection } from "./ThemeSelection";
import { ThemeTraits } from "./ThemeTraits";

export function PageContent() {
  return (
    <>
      <Col xs={12} sm={6} md={4} lg={3} xl={2}>
        <ThemeSelection />
      </Col>
      <Col>
        <ThemeTraits />
      </Col>
    </>
  );
}
