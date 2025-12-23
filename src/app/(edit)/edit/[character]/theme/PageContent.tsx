"use client";

import Col from "react-bootstrap/Col";
import { ThemeSelection } from "./ThemeSelection";
import { ThemeTraits } from "./ThemeTraits";
import { Row } from "react-bootstrap";
import { Theme } from "model";
import { UpdateState } from "./actions";
import { useState } from "react";

export function PageContent({ themes, initial }: Readonly<{ themes: Theme[]; initial: UpdateState }>) {
  const [state, setState] = useState(initial);

  return (
    <Row>
      <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
        <ThemeSelection themes={themes} state={state} setState={setState} />
      </Col>
      <Col>
        <ThemeTraits state={state} />
      </Col>
    </Row>
  );
}
