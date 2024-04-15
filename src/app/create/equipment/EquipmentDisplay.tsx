"use client";

import { EquipmentBase, EquipmentDescriptor } from "model";
import { useState } from "react";
import { Button, Card, Col, Collapse, FormControl, InputGroup, Row } from "react-bootstrap";
import { Credits } from "./Components";
import { mutators, useAppDispatch } from "logic";

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
  const dispatch = useAppDispatch();

  function handleDecreaseClick() {
    dispatch(mutators.updateEquipmentQuantity({ id: descriptor.id, delta: -1 }));
  }

  function handleIncreaseClick() {
    dispatch(mutators.updateEquipmentQuantity({ id: descriptor.id, delta: 1 }));
  }

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
          {descriptor.type === "consumable" && (
            <Collapse in={!open} dimension="width">
              <Col xs="auto" style={{ textWrap: "nowrap" }}>
                x {descriptor.quantity}
              </Col>
            </Collapse>
          )}
        </Row>
      </Card.Header>
      <Collapse in={open}>
        <Card.Body>
          {children}
          <hr />
          <div className="small text-muted">{equipment.description}</div>
        </Card.Body>
      </Collapse>
      <Collapse in={open}>
        <Card.Footer>
          <Row>
            <Col className="align-self-center text-center">
              <Credits value={descriptor.unitaryCost} />
            </Col>
            <Col>
              {descriptor.type === "consumable" && (
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
              )}
            </Col>
          </Row>
        </Card.Footer>
      </Collapse>
    </Card>
  );
}
