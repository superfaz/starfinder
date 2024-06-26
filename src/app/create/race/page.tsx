import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { RaceSelection } from "./RaceSelection";
import { RaceTraits } from "./RaceTraits";
import { RaceAlternateTraits } from "./RaceAlternateTraits";

export const metadata: Metadata = {
  title: "Sélection de la race",
};

export default function Page() {
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
