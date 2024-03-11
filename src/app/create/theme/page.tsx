import Col from "react-bootstrap/Col";
import { ThemeSelection } from "./ThemeSelection";
import { ThemeTraits } from "./ThemeTraits";

export default function Page() {
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
