"use client";

import { ChangeEvent } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { mutators, useAppDispatch } from "logic";
import { EquipmentDescriptor } from "model";
import { useCharacterPresenter } from "../helpers";
import { WeaponMeleeDisplay } from "./WeaponMeleeDisplay";
import { WeaponRangedDisplay } from "./WeaponRangedDisplay";
import { WeaponGrenadeDisplay } from "./WeaponGrenadeDisplay";
import { WeaponAmmunitionDisplay } from "./WeaponAmmunitionDisplay";
import { WeaponSolarianDisplay } from "./WeaponSolarianDisplay";

export function EquipmentDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  if (descriptor.category === "weapon") {
    switch (descriptor.secondaryType) {
      case "ammunition":
        return <WeaponAmmunitionDisplay descriptor={descriptor} />;
      case "basic":
      case "advanced":
        return <WeaponMeleeDisplay descriptor={descriptor} />;
      case "small":
      case "long":
      case "heavy":
      case "sniper":
        return <WeaponRangedDisplay descriptor={descriptor} />;
      case "grenade":
        return <WeaponGrenadeDisplay descriptor={descriptor} />;
      case "solarian":
        return <WeaponSolarianDisplay descriptor={descriptor} />;
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
        <EquipmentDisplay key={weapon.id} descriptor={weapon} />
      ))}
      <h2>Armures</h2>
      <h2>Autres</h2>
    </Stack>
  );
}
