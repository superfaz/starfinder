import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { displayBonus, findOrError } from "app/helpers";
import { Badge } from "app/components";
import { useAppSelector } from "logic";
import { EquipmentArmor, EquipmentArmorIds, EquipmentDescriptor } from "model";
import { ValueComponent } from "./ValueComponent";
import { CharacterProps } from "../Props";

async function getArmor(descriptor: EquipmentDescriptor): Promise<EquipmentArmor> {
  return fetch(`/api/equipment/armors/${descriptor.secondaryType}`)
    .then((res) => res.json())
    .then((data) => {
      const equipments = data as EquipmentArmor[];
      return findOrError(equipments, (e) => e.id === descriptor.equipmentId);
    });
}

function CardArmor({ descriptor }: Readonly<{ descriptor: EquipmentDescriptor }>) {
  const armorTypes = useAppSelector((state) => state.data.armorTypes);
  const [armor, setArmor] = useState<EquipmentArmor | undefined>(undefined);

  useEffect(() => {
    getArmor(descriptor).then(setArmor);
  }, [descriptor]);

  if (armor === undefined) {
    return null;
  }

  return (
    <Card.Body className="small py-2">
      <Row>
        <Col>
          <ValueComponent label={findOrError(armorTypes, armor.type).name} value={armor.name} />
        </Col>
        <Col xs="auto">
          <ValueComponent label="CAE" value={displayBonus(armor.eacBonus)} />
        </Col>
        <Col xs="auto">
          <ValueComponent label="CAC" value={displayBonus(armor.kacBonus)} />
        </Col>
      </Row>
    </Card.Body>
  );
}

export function CardArmorClass({ presenter }: CharacterProps) {
  const armorTypes = useAppSelector((state) => state.data.armorTypes);
  const proficiencies = presenter.getArmorProficiencies();
  const texts = proficiencies.map((p) => findOrError(armorTypes, p).name);
  const armorClasses = {
    energy: { value: presenter.getEnergyArmorClass(), label: "Classe d’armure énergétique" },
    kinetic: { value: presenter.getKineticArmorClass(), label: "Classe d’armure cinétique" },
    maneuvers: { value: presenter.getArmorClassAgainstCombatManeuvers(), label: "CA vs manoeuvres offensives" },
  };
  const armors = presenter.getArmors().filter((a) => a.secondaryType !== EquipmentArmorIds.upgrade);

  return (
    <Card data-testid="armors">
      <Card.Header>
        <Badge bg="primary">Classe d&apos;armure</Badge>
      </Card.Header>
      <Card.Body className="position-relative small py-2">
        {texts.length > 0 && <span>Formations : {texts.join(", ")}</span>}
      </Card.Body>
      <Card.Body className="position-relative">
        <Row>
          {Object.entries(armorClasses).map(([key, { label, value }]) => (
            <ValueComponent key={key} label={label} className="col" value={value} />
          ))}
        </Row>
      </Card.Body>
      {armors.map((descriptor) => (
        <CardArmor key={descriptor.id} descriptor={descriptor} />
      ))}
    </Card>
  );
}
