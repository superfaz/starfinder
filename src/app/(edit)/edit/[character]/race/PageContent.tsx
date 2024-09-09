import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { RaceSelection } from "./RaceSelection";
import { RaceTraits } from "./RaceTraits";
import { RaceAlternateTraits } from "./RaceAlternateTraits";

export function PageContent() {
  return (
    <Row>
      <Col xs={12} sm={6} md={4} lg={3} xl={2} className="mb-3">
        <RaceSelection />
      </Col>
      <Col xs={12} sm={6} className="col-md">
        <Row>
          <Col xs={12} sm={12} md={6} className="mb-3">
            <RaceTraits />
          </Col>
          <Col>
            <RaceAlternateTraits />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
