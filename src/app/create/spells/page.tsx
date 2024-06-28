import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { SpellsSelection } from "./SpellsSelection";
import { secure } from "../helpers";

export const metadata: Metadata = {
  title: "Sélection des sorts",
};

export default secure(
  <Col lg={12}>
    <SpellsSelection />
  </Col>,
  "/create/spells"
);
