"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Collapse from "react-bootstrap/Collapse";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { EquipmentBase, EquipmentDescriptor, EquipmentWeaponFusion, EquipmentWeaponFusionSchema } from "model";
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

function useFusion(id: string): EquipmentWeaponFusion | null {
  const [fusion, setFusion] = useState<EquipmentWeaponFusion | null>(null);

  useEffect(() => {
    fetch(`/api/equipment/weapons/fusions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const fusion = EquipmentWeaponFusionSchema.parse(data);
        setFusion(fusion);
      });
  }, [id]);

  return fusion;
}

function DisplayMaterial({ descriptor }: Readonly<{ descriptor: EquipmentDescriptor }>) {
  const materials = useAppSelector((state) => state.data.equipmentMaterials);
  const material = findOrError(materials, descriptor.material);

  return (
    <Badge bg="secondary" className="mb-2">
      {material.name}
    </Badge>
  );
}

function DisplayFusion({ id }: Readonly<{ id: string }>) {
  const fusion = useFusion(id);
  if (!fusion) return null;

  return (
    <Badge bg="secondary" className="mb-2">
      {fusion.name}
    </Badge>
  );
}

export function GenericEquipmentDisplay({
  descriptor,
  equipment,
  selected,
  subtitle,
  children,
}: Readonly<{
  descriptor: EquipmentDescriptor;
  equipment: EquipmentBase;
  selected: boolean;
  subtitle?: string;
  children?: React.ReactNode;
}>) {
  const [open, setOpen] = useState(selected);
  const dispatch = useAppDispatch();

  function handleDecreaseClick() {
    dispatch(mutators.updateEquipmentQuantity({ id: descriptor.id, delta: -1 }));
  }

  function handleIncreaseClick() {
    dispatch(mutators.updateEquipmentQuantity({ id: descriptor.id, delta: 1 }));
  }

  return (
    <Card>
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
          <Stack direction="horizontal" gap={2}>
            {descriptor.material && <DisplayMaterial descriptor={descriptor} />}
            {descriptor.category === "weapon" && descriptor.fusions?.map((id) => <DisplayFusion key={id} id={id} />)}
          </Stack>
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
              {!selected && descriptor.type === "consumable" && (
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
              {!selected && descriptor.type !== "consumable" && (
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
