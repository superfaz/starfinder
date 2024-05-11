"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Button, ButtonGroup, Card, Col, Collapse, FormControl, InputGroup, Row } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { EquipmentBase, EquipmentDescriptor } from "model";
import { Credits } from "./Components";

export function useEquipment<T extends EquipmentBase>(descriptor: EquipmentDescriptor): T | null {
  const [equipment, setEquipment] = useState<T | null>(null);

  useEffect(() => {
    fetch(`/api/equipment/${descriptor.category}s/${descriptor.secondaryType}`)
      .then((res) => res.json())
      .then((data) => {
        const equipments = data as T[];
        setEquipment(findOrError(equipments, (e) => e.id === descriptor.equipmentId));
      });
  }, [descriptor.category, descriptor.secondaryType, descriptor.equipmentId]);

  return equipment;
}

function DisplayMaterial({ descriptor }: { descriptor: EquipmentDescriptor }) {
  const materials = useAppSelector((state) => state.data.equipmentMaterials);
  const material = findOrError(materials, descriptor.material);

  return (
    <Badge bg="secondary" className="mb-2">
      {material.name}
    </Badge>
  );
}

export function EquipmentDisplay({
  descriptor,
  equipment,
  selected,
  subtitle,
  children,
}: {
  descriptor: EquipmentDescriptor;
  equipment: EquipmentBase;
  selected: boolean;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(selected);
  const dispatch = useAppDispatch();

  function handleDecreaseClick() {
    dispatch(mutators.updateEquipmentQuantity({ id: descriptor.id, delta: -1 }));
  }

  function handleIncreaseClick() {
    dispatch(mutators.updateEquipmentQuantity({ id: descriptor.id, delta: 1 }));
  }

  return (
    <Card className={selected ? "border-primary" : undefined}>
      <Card.Header role={selected ? undefined : "button"} onClick={selected ? undefined : () => setOpen(!open)}>
        <Row>
          <Col>
            <div className="fw-bold">
              {descriptor.name ?? equipment.name} (niv. {equipment.level})
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
          {descriptor.material && <DisplayMaterial descriptor={descriptor} />}
          <hr />
          <div className="small text-muted">{descriptor.description ?? equipment.description}</div>
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
              {descriptor.type !== "consumable" && (
                <ButtonGroup className="right">
                  <Link className="text-nowrap btn btn-secondary" href={`/create/equipment/${descriptor.id}`}>
                    <i className="bi-pencil"></i> Modifier
                  </Link>
                  <Button variant="outline-secondary" onClick={handleDecreaseClick}>
                    <i className="bi-x-lg"></i>
                  </Button>
                </ButtonGroup>
              )}
            </Col>
          </Row>
        </Card.Footer>
      </Collapse>
    </Card>
  );
}
