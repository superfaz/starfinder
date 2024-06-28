import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { secure } from "../helpers";
import { PageClient } from "./PageClient";

export const metadata: Metadata = {
  title: "Fiche de personnage",
};

export default secure(
  <Col lg={12}>
    <PageClient />
  </Col>,
  "/create/sheet"
);
