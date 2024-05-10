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
import { ArmorDisplay } from "./ArmorDisplay";

export function EquipmentDisplay({ descriptor, selected }: { descriptor: EquipmentDescriptor; selected: boolean }) {
  if (descriptor.category === "weapon") {
    switch (descriptor.secondaryType) {
      case "ammunition":
        return <WeaponAmmunitionDisplay descriptor={descriptor} selected={selected} />;
      case "basic":
      case "advanced":
        return <WeaponMeleeDisplay descriptor={descriptor} selected={selected} />;
      case "small":
      case "long":
      case "heavy":
      case "sniper":
        return <WeaponRangedDisplay descriptor={descriptor} selected={selected} />;
      case "grenade":
        return <WeaponGrenadeDisplay descriptor={descriptor} selected={selected} />;
      case "solarian":
        return <WeaponSolarianDisplay descriptor={descriptor} selected={selected} />;
      default:
        return null;
    }
  } else if (descriptor.category === "armor") {
    return <ArmorDisplay descriptor={descriptor} selected={selected} />;
  } else {
    return null;
  }
}

export function EquipmentSelected({ selected }: { selected?: string }) {
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
      {presenter.getWeapons().length === 0 && <em>Pas d&apos;arme possédée</em>}
      {presenter.getWeapons().map((weapon) => (
        <EquipmentDisplay key={weapon.id} descriptor={weapon} selected={selected === weapon.id} />
      ))}
      <h2>Armures</h2>
      {presenter.getArmors().length === 0 && <em>Pas d&apos;armure possédée</em>}
      {presenter.getArmors().map((armor) => (
        <EquipmentDisplay key={armor.id} descriptor={armor} selected={selected === armor.id} />
      ))}
      <h2>Autres</h2>
      <em>Pas d&apos;autre objet possédé</em>
    </Stack>
  );
}
