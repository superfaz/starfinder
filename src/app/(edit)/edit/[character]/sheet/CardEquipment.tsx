import { ReactNode } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Badge } from "ui";
import {
  ArmorEquipmentDescriptor,
  EquipmentArmorIds,
  EquipmentArmorUpgrade,
  EquipmentWeaponAmmunition,
  EquipmentWeaponIds,
  WeaponEquipmentDescriptor,
} from "model";
import { CharacterProps } from "../Props";
import { useEquipment } from "../equipment/GenericEquipmentDisplay";
import { ValueComponent } from "./ValueComponent";
import { useAppSelector } from "logic";
import { findOrError } from "app/helpers";

function AmmunitionSection({ descriptor }: Readonly<{ descriptor: WeaponEquipmentDescriptor }>): ReactNode {
  const equipment = useEquipment<EquipmentWeaponAmmunition>(descriptor);

  if (equipment === null) {
    return null;
  }

  if (equipment.category === "special") {
    return (
      <Row>
        <Col xs="auto">
          <ValueComponent label="Quantité" value={descriptor.quantity} />
        </Col>
        <Col>
          <ValueComponent label="Munitions spéciales" value={descriptor.name ?? equipment.name} />
        </Col>
      </Row>
    );
  } else {
    return (
      <Row>
        <Col xs="auto">
          <ValueComponent label="Quantité" value={descriptor.quantity} />
        </Col>
        <Col>
          <ValueComponent label="Munitions standards" value={descriptor.name ?? equipment.name} />
        </Col>
        <Col xs="auto">
          <ValueComponent label="Capacité" value={equipment.capacity} />
        </Col>
      </Row>
    );
  }
}

function UpgradeSection({ descriptor }: Readonly<{ descriptor: ArmorEquipmentDescriptor }>): ReactNode {
  const equipment = useEquipment<EquipmentArmorUpgrade>(descriptor);
  const armorTypes = useAppSelector((state) => state.data.armorTypes);

  if (equipment === null) {
    return null;
  }

  const types = equipment.armorTypes.map((t) => findOrError(armorTypes, t).name.replace("Armures ", "")).join(", ");

  return (
    <Row>
      <Col>
        <ValueComponent label={types} value={descriptor.name ?? equipment.name} />
      </Col>
    </Row>
  );
}

export default function CardEquipment({ presenter }: CharacterProps) {
  const ammunitions = presenter
    .getWeapons()
    .filter((w) => w.secondaryType === EquipmentWeaponIds.ammunition) as WeaponEquipmentDescriptor[];
  const armorUpgrades = presenter
    .getArmors()
    .filter((a) => a.secondaryType === EquipmentArmorIds.upgrade) as ArmorEquipmentDescriptor[];

  return (
    <Card data-testid="description">
      <Card.Header>
        <Badge bg="primary">Equipement</Badge>
      </Card.Header>
      <Card.Body className="small">
        <Badge bg="secondary" className="me-auto">
          Munitions
        </Badge>
        {ammunitions.length === 0 && (
          <p>
            <em>Aucune</em>
          </p>
        )}
        {ammunitions.map((a) => (
          <AmmunitionSection key={a.id} descriptor={a} />
        ))}
      </Card.Body>

      <Card.Body className="small">
        <Badge bg="secondary" className="me-auto">
          Améliorations d&apos;armure
        </Badge>
        {armorUpgrades.length === 0 && (
          <p>
            <em>Aucune</em>
          </p>
        )}
        {armorUpgrades.map((a) => (
          <UpgradeSection key={a.id} descriptor={a} />
        ))}
      </Card.Body>
    </Card>
  );
}
