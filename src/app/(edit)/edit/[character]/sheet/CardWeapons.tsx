import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { DisplayCritical, DisplayDamage, DisplayRange, DisplaySpecials } from "app/components";
import { displayBonus, findOrError } from "app/helpers";
import { CharacterPresenter, useAppSelector } from "logic";
import { EquipmentDescriptor, EquipmentWeapon } from "model";
import { Badge } from "ui";
import { DisplayFusions } from "../equipment/Components";
import { CharacterProps } from "../Props";
import { ValueComponent } from "./ValueComponent";

function getWeapon(descriptor: EquipmentDescriptor): Promise<EquipmentWeapon> {
  return fetch(`/api/equipment/weapons/${descriptor.secondaryType}`)
    .then((res) => res.json())
    .then((data) => {
      const equipments = data as EquipmentWeapon[];
      return findOrError(equipments, (e) => e.id === descriptor.equipmentId);
    });
}

function useWeaponLabel(weapon?: EquipmentWeapon): string {
  const weaponTypes = useAppSelector((state) => state.data.weaponTypes);
  if (weapon === undefined) {
    return "";
  }

  if (weapon.type === "weaponMelee" || weapon.type === "weaponRanged" || weapon.type === "weaponGrenade") {
    return findOrError(weaponTypes, weapon.weaponType).name;
  } else if (weapon.type === "weaponAmmunition") {
    return "Munitions";
  } else if (weapon.type === "weaponSolarian") {
    return "Cristaux solarien";
  } else {
    throw new Error("Unknown weapon type");
  }
}

function computeModifierFor(weapon: EquipmentWeapon, presenter: CharacterPresenter): number {
  const bonuses = presenter.getAttackBonuses();

  if (!bonuses) {
    return 0;
  }

  if (weapon.type === "weaponMelee") {
    const isOperativeWeapon = weapon.specials.some((s) => s.id === "operative");
    return isOperativeWeapon ? Math.max(bonuses.melee, bonuses.ranged) : bonuses.melee;
  } else if (weapon.type === "weaponRanged") {
    return bonuses.ranged;
  } else if (weapon.type === "weaponGrenade") {
    return bonuses.thrown;
  } else {
    return 0;
  }
}

function CardWeapon({
  presenter,
  descriptor,
}: Readonly<{ presenter: CharacterPresenter; descriptor: EquipmentDescriptor }>) {
  const [weapon, setWeapon] = useState<EquipmentWeapon | undefined>(undefined);
  const label = useWeaponLabel(weapon);

  useEffect(() => {
    getWeapon(descriptor).then(setWeapon);
  }, [descriptor]);

  if (weapon === undefined) {
    return null;
  }

  return (
    <Card.Body className="small py-2">
      <Row>
        <Col>
          <ValueComponent label={label} value={descriptor.name ?? weapon.name} />
        </Col>
        {(weapon.type === "weaponMelee" || weapon.type === "weaponRanged") && (
          <Col xs="auto">
            <ValueComponent label="Main(s)" value={weapon.hands} />
          </Col>
        )}
        <Col xs="auto">
          <ValueComponent label="Niv." value={weapon.level} />
        </Col>
      </Row>
      <Row>
        {(weapon.type === "weaponRanged" || weapon.type === "weaponGrenade") && (
          <Col xs="auto">
            <ValueComponent label="Portée">
              <DisplayRange value={weapon.range} />
            </ValueComponent>
          </Col>
        )}
        {(weapon.type === "weaponRanged" || weapon.type === "weaponMelee" || weapon.type === "weaponGrenade") && (
          <Col xs="auto">
            <ValueComponent label="Att.">
              <Badge bg="primary">{displayBonus(computeModifierFor(weapon, presenter))}</Badge>
            </ValueComponent>
          </Col>
        )}
        <Col xs="auto">
          <ValueComponent label="Dégâts">
            {(weapon.type === "weaponRanged" || weapon.type === "weaponMelee" || weapon.type === "weaponSolarian") && (
              <DisplayDamage damage={weapon.damage} />
            )}
          </ValueComponent>
        </Col>
        <Col>
          <ValueComponent label="Critique">
            {(weapon.type === "weaponRanged" || weapon.type === "weaponMelee" || weapon.type === "weaponSolarian") && (
              <DisplayCritical critical={weapon.critical} />
            )}
          </ValueComponent>
        </Col>
      </Row>
      <Row>
        {weapon.type === "weaponRanged" && (
          <Col xs="auto">
            <ValueComponent label="Munitions">
              <span>
                {weapon.ammunition.type} {weapon.ammunition.capacity}/{weapon.ammunition.usage}
              </span>
            </ValueComponent>
          </Col>
        )}
        {(weapon.type === "weaponRanged" || weapon.type === "weaponMelee" || weapon.type === "weaponGrenade") && (
          <Col>
            <ValueComponent label="Spécial">
              <DisplaySpecials specials={weapon.specials} />
            </ValueComponent>
          </Col>
        )}
      </Row>
      {descriptor.category === "weapon" && descriptor.fusions && (
        <Row>
          <Col>
            <ValueComponent label="Fusions">
              <DisplayFusions fusions={descriptor.fusions} />
            </ValueComponent>
          </Col>
        </Row>
      )}
    </Card.Body>
  );
}

export function CardWeapons({ presenter }: CharacterProps) {
  const weaponTypes = useAppSelector((state) => state.data.weaponTypes);
  const proficiencies = presenter
    .getWeaponProficiencies()
    .map((p) => findOrError(weaponTypes, p))
    .sort((a, b) => a.order - b.order)
    .map((p) => p.name);
  const weapons = presenter.getWeapons().filter((w) => w.secondaryType !== "ammunition");

  return (
    <Card data-testid="weapons">
      <Card.Header>
        <Badge bg="primary">Armes</Badge>
      </Card.Header>
      <Card.Body className="small py-2">
        <span>Formations : {proficiencies.join(", ")}</span>
        {proficiencies.length === 0 && <em>Pas de classe sélectionnée</em>}
      </Card.Body>
      {weapons.map((descriptor) => (
        <CardWeapon key={descriptor.id} presenter={presenter} descriptor={descriptor} />
      ))}
    </Card>
  );
}
