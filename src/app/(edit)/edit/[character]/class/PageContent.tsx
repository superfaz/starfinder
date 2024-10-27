"use client";

import { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { UpdateState } from "./actions";
import { ClassSelection } from "./ClassSelection";
import { ClassDetails } from "./ClassDetails";
import { INamedModel } from "model";

export function PageContent({ classes, initial }: Readonly<{ classes: INamedModel[]; initial: UpdateState }>) {
  const [state, setState] = useState<UpdateState>(initial);

  return (
    <Row>
      <Col xs={12} sm={6} md={4} lg={3} xl={2}>
        <ClassSelection classes={classes} state={state} setState={setState} />
      </Col>
      <Col>
        <ClassDetails state={state} />
      </Col>
    </Row>
  );
}
