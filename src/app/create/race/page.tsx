import Col from "react-bootstrap/Col";
import { RaceSelection } from "./RaceSelection";
import { RaceTraits } from "./RaceTraits";
import { RaceAlternateTraits } from "./RaceAlternateTraits";

export default function Page() {
  return (
    <>
      <Col lg={3}>
        <RaceSelection />
      </Col>
      <Col>
        <RaceTraits />
      </Col>
      <Col>
        <RaceAlternateTraits />
      </Col>
    </>
  );
}
