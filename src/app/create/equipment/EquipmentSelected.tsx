"use client";

import { mutators, useAppDispatch, useAppSelector } from "logic";
import { ChangeEvent, useEffect, useState } from "react";
import { Card, Col, Form, Row, Stack } from "react-bootstrap";
import { useCharacterPresenter } from "../helpers";
import { Critical, Damage, EquipmentDescriptor, EquipmentWeaponMelee, EquipmentWeaponRanged, Special } from "model";
import { findOrError } from "app/helpers";

export function EquipmentDamage({ damage, critical }: { damage: Damage; critical: Critical | undefined }) {
  const data = useAppSelector((state) => state.data);

  const roll = damage.roll;
  const types = damage.types.map((t) => findOrError(data.damageTypes, t).name).join(" & ");

  if (!critical) {
    return `${roll} ${types}`;
  }

  const criticalHitEffect = findOrError(data.criticalHitEffects, critical.id);
  if (!critical.value) {
    return `${roll} ${types} - ${criticalHitEffect.name}`;
  } else {
    return `${roll} ${types} - ${criticalHitEffect.name} ${critical.value}`;
  }
}

export function EquipmentSpecials({ specials }: { specials: Special[] }) {
  const data = useAppSelector((state) => state.data);

  if (specials.length === 0) {
    return null;
  }

  const specialTexts = specials.map((s) => {
    const special = findOrError(data.weaponSpecialProperties, s.id);
    return s.value ? `${special.name} (${s.value})` : special.name;
  });

  return <div className="text-muted">{specialTexts.join(", ")}</div>;
}

export function WeaponMeleeDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
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

  return (
    <Card>
      <Card.Body>
        <div>
          <strong>
            {equipment.name} (niv. {equipment.level})
          </strong>
        </div>
        <div className="mb-2 small">
          {findOrError(data.weaponTypes, equipment.weaponType).name}{" "}
          {equipment.hands === 2 ? "à deux mains" : "à une main"}
        </div>
        {equipment.damage && (
          <div>
            <EquipmentDamage damage={equipment.damage} critical={equipment.critical} />
          </div>
        )}
        <EquipmentSpecials specials={equipment.specials} />
      </Card.Body>
    </Card>
  );
}

export function WeaponRangedDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  const data = useAppSelector((state) => state.data);
  const [equipment, setEquipment] = useState<EquipmentWeaponRanged | null>(null);

  useEffect(() => {
    fetch(`/api/equipment/weapons/${descriptor.secondaryType}`)
      .then((res) => res.json())
      .then((data) => {
        const equipments = data as EquipmentWeaponRanged[];
        setEquipment(findOrError(equipments, (e) => e.id === descriptor.id));
      });
  });

  if (!equipment) {
    return null;
  }

  return (
    <Card>
      <Card.Body>
        <div>
          <strong>
            {equipment.name} (niv. {equipment.level})
          </strong>
        </div>
        <div className="mb-2 small">
          {findOrError(data.weaponTypes, equipment.weaponType).name}{" "}
          {equipment.hands === 2 ? "à deux mains" : "à une main"}
        </div>
        <div>
          {equipment.range * 1.5}m -{" "}
          {equipment.damage && <EquipmentDamage damage={equipment.damage} critical={equipment.critical} />}
        </div>
        <EquipmentSpecials specials={equipment.specials} />
        <div>
          {equipment.ammunition.type} ({equipment.ammunition.usage}/{equipment.ammunition.capacity})
        </div>
      </Card.Body>
    </Card>
  );
}

export function EquipmentDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  if (descriptor.category === "weapon") {
    switch (descriptor.secondaryType) {
      case "basic":
      case "advanced":
        return <WeaponMeleeDisplay descriptor={descriptor} />;
      case "small":
      case "long":
      case "heavy":
      case "sniper":
        return <WeaponRangedDisplay descriptor={descriptor} />;
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
