"use client";

import { mutators, useAppDispatch, useAppSelector } from "logic";
import { ChangeEvent, useEffect, useState } from "react";
import { Card, Col, Form, Row, Stack } from "react-bootstrap";
import { useCharacterPresenter } from "../helpers";
import { EquipmentDescriptor, EquipmentWeaponMelee } from "model";
import { findOrError } from "app/helpers";

interface IValueComponentProps {
  label: string;
  value?: string | number;
  title?: string;
  className?: string;
  children?: JSX.Element[] | JSX.Element;
}

type ValueComponentProps = Readonly<IValueComponentProps>;

function ValueComponent({ label, value, title, className, children }: ValueComponentProps) {
  return (
    <div className={className} title={title} data-testid={label}>
      {children && <div>{children}</div>}
      {!children && <div>{value === undefined || value === "" ? "-" : value}</div>}
      <div className="small text-muted border-top border-secondary">{label}</div>
    </div>
  );
}

export function EquipmentDescriptorMeleeDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  const data = useAppSelector((state) => state.data);
  const [equipment, setEquipment] = useState<EquipmentWeaponMelee | null>(null);

  useEffect(() => {
    fetch(`/api/equipment/weapons/${descriptor.secondaryType}`)
      .then((res) => res.json())
      .then((data) => {
        const equipments = data as EquipmentWeaponMelee[];
        setEquipment(findOrError(equipments, (e) => e.id === descriptor.id));
      });
  });

  if (!equipment) {
    return null;
  }

  const critical = equipment.critical ? findOrError(data.criticalHitEffects, equipment.critical.id) : null;
  const criticalText = critical
    ? equipment.critical?.value
      ? `${critical.name} (${equipment.critical.value})`
      : critical.name
    : "-";
  return (
    <Card className="placeholder-glow">
      <Card.Body>
        <Row>
          <Col>
            <ValueComponent label="Nom (Niveau)" value={equipment.name + " (" + equipment.level + ")"} />
          </Col>
          <Col xs="auto">
            <ValueComponent label="Prix" value={descriptor.unitaryCost} />
          </Col>
          <Col xs="auto">
            <ValueComponent label="Quantité" value={descriptor.quantity} />
          </Col>
        </Row>
        <Row>
          <Col>
            <ValueComponent label="Dégâts" value={equipment.damage?.roll} />
          </Col>
          <Col>
            <ValueComponent label="Critique" value={criticalText} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export function EquipmentDescriptorDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  if (descriptor.category === "weapon") {
    switch (descriptor.secondaryType) {
      case "basic":
      case "advanced":
        return <EquipmentDescriptorMeleeDisplay descriptor={descriptor} />;
      case "small":
      default:
        return null;
    }
  }
}

export function EquipmentSelected() {
  const presenter = useCharacterPresenter();
  const dispatch = useAppDispatch();

  function handleInitialCapitalChange(e: ChangeEvent<HTMLInputElement>): void {
    const value = parseInt(e.target.value, 10);
    dispatch(mutators.updateInitialCapital(value));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Crédits</h2>
      <Row className="mb-3">
        <Col>
          <Form.FloatingLabel controlId="initial-capital" label="Capital initial">
            <Form.Control type="number" value={presenter.getInitialCapital()} onChange={handleInitialCapitalChange} />
          </Form.FloatingLabel>
        </Col>
        <Col>
          <Form.FloatingLabel controlId="credits" label="Restant">
            <Form.Control type="number" value={presenter.getCredits()} disabled />
          </Form.FloatingLabel>
        </Col>
      </Row>
      <h2>Armes</h2>
      {presenter.getWeapons().length === 0 && <em>Pas d&apos;armes possédées</em>}
      {presenter.getWeapons().map((weapon) => (
        <EquipmentDescriptorDisplay key={weapon.id} descriptor={weapon} />
      ))}
      <h2>Armures</h2>
      <h2>Autres</h2>
    </Stack>
  );
}
