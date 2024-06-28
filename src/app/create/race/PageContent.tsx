import Col from "react-bootstrap/Col";
import { RaceSelection } from "./RaceSelection";
import { RaceTraits } from "./RaceTraits";
import { RaceAlternateTraits } from "./RaceAlternateTraits";

export function PageContent() {
  return (
    <>
      <Col xs={12} lg={3}>
        <RaceSelection />
      </Col>
      <Col xs={12} className="col-lg">
        <RaceTraits />
      </Col>
      <Col xs={12} className="col-lg">
        <RaceAlternateTraits />
      </Col>
    </>
  );
}
