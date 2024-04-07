"use client";

import { EquipmentBase, EquipmentDescriptor } from "model";
import { useState } from "react";
import { Button, Card, Col, Collapse, FormControl, InputGroup, Row } from "react-bootstrap";
import { Credits } from "./Components";

export function EquipmentDisplay({
  descriptor,
  equipment,
  subtitle,
  children,
}: {
  descriptor: EquipmentDescriptor;
  equipment: EquipmentBase;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  function handleDecreaseClick() {}
  function handleIncreaseClick() {}

  return (
    <Card>
      <Card.Header role="button" onClick={() => setOpen(!open)}>
        <Row>
          <Col>
            <div className="fw-bold">
              {equipment.name} (niv. {equipment.level})
            </div>
            {subtitle && <div className="small">{subtitle}</div>}
          </Col>
          <Collapse in={!open} dimension="width">
            <Col xs="auto" style={{ textWrap: "nowrap" }}>
              x {descriptor.quantity}
            </Col>
          </Collapse>
        </Row>
      </Card.Header>
      <Collapse in={open}>
        <Card.Body>{children}</Card.Body>
      </Collapse>
      <Collapse in={open}>
        <Card.Footer>
          <Row>
            <Col className="align-self-center text-center">
              <Credits value={descriptor.unitaryCost} />
            </Col>
            <Col>
              <InputGroup>
                <Button variant="outline-secondary" onClick={handleDecreaseClick}>
                  <i className="bi-dash-lg"></i>
                </Button>
                <FormControl
                  type="number"
                  min={0}
                  className="text-center"
                  value={descriptor.quantity}
                  disabled={true}
                />
                <Button variant="outline-secondary" onClick={handleIncreaseClick}>
                  <i className="bi-plus-lg"></i>
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Card.Footer>
      </Collapse>
    </Card>
  );
}
