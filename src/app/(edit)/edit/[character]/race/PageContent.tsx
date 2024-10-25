"use client";

import { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Race } from "model";
import { UpdateState } from "./actions";
import { RaceAlternateTraits } from "./RaceAlternateTraits";
import { RaceSelection } from "./RaceSelection";
import { RaceTraits } from "./RaceTraits";

export function PageContent({ races, initial }: Readonly<{ races: Race[]; initial: UpdateState }>) {
  const [state, setState] = useState(initial);

  return (
    <Row>
      <Col xs={12} sm={6} md={4} lg={3} xl={2} className="mb-3">
        <RaceSelection races={races} state={state} setState={setState} />
      </Col>
      <Col xs={12} sm={6} className="col-md">
        <Row>
          <Col xs={12} sm={12} md={6} className="mb-3">
            <RaceTraits state={state} />
          </Col>
          <Col>
            <RaceAlternateTraits state={state} setState={setState} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
