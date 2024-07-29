import Col from "react-bootstrap/Col";
import { RaceSelection } from "./RaceSelection";
import { RaceTraits } from "./RaceTraits";
import { RaceAlternateTraits } from "./RaceAlternateTraits";

export function PageContent() {
  return (
    <>
      <Col xs={12} sm={6} md={4} lg={3} xl={2}>
        <RaceSelection />
      </Col>
      <Col xs={12} sm={6} className="col-md">
        <RaceTraits />
      </Col>
      <Col xs={12} sm={6} className="offset-sm-6 offset-md-0 col-md">
        <RaceAlternateTraits />
      </Col>
    </>
  );
}
