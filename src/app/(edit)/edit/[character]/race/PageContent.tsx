"use client";

import Link from "next/link";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { RaceAlternateTraits } from "./RaceAlternateTraits";
import { RaceSelection } from "./RaceSelection";
import { RaceTraits } from "./RaceTraits";

export function PageContent() {
  function handleSave() {
  }

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
      <Col xs={12} className="fixed-bottom py-2 bg-darkblue">
        <Row>
          <Col>
            <Button className="w-100" onClick={handleSave}>
              Modifier
            </Button>
          </Col>
          <Col>
            <Link className="btn btn-outline-secondary w-100" href=".">
              Annuler
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
