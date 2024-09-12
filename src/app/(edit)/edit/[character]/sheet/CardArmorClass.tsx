import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { displayBonus, findOrError } from "app/helpers";
import { Badge } from "ui";
import { ICharacterPresenter, useAppSelector } from "logic";
import { EquipmentArmor, EquipmentArmorIds, EquipmentDescriptor, ModifierTypes, ofType } from "model";
import { ValueComponent } from "./ValueComponent";

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

export function CardArmorClass({ presenter }: Readonly<{ presenter: ICharacterPresenter }>) {
  const armorTypes = useAppSelector((state) => state.data.armorTypes);
  const damageTypes = useAppSelector((state) => state.data.damageTypes);

  const proficiencies = presenter.getArmorProficiencies();
  const armorClasses = {
    energy: { value: presenter.getEnergyArmorClass(), label: "Classe d’armure énergétique" },
    kinetic: { value: presenter.getKineticArmorClass(), label: "Classe d’armure cinétique" },
    maneuvers: { value: presenter.getArmorClassAgainstCombatManeuvers(), label: "CA vs manoeuvres offensives" },
  };
  const reductions = presenter.getModifiers().filter(ofType(ModifierTypes.damageReduction));
  const resistances = presenter.getModifiers().filter(ofType(ModifierTypes.resistance));
  const armors = presenter.getArmors()?.filter((a) => a.secondaryType !== EquipmentArmorIds.upgrade) ?? [];

  return (
    <Card data-testid="armors">
      <Card.Header>
        <Badge bg="primary">Classe d&apos;armure</Badge>
      </Card.Header>
      {proficiencies && proficiencies.length > 0 && (
        <Card.Body className="position-relative small py-2">
          <span>Formations : {proficiencies.map((p) => findOrError(armorTypes, p).name).join(", ")}</span>
        </Card.Body>
      )}
      <Card.Body className="position-relative py-2">
        <Row>
          {Object.entries(armorClasses).map(([key, { label, value }]) => (
            <ValueComponent key={key} label={label} className="col" value={value} />
          ))}
        </Row>
      </Card.Body>
      {reductions.length > 0 && (
        <Card.Body className="position-relative small py-2">
          RD : {reductions.map((r) => r.value + "/—").join(", ")}
        </Card.Body>
      )}
      {resistances.length > 0 && (
        <Card.Body className="position-relative small py-2">
          Résistances : {resistances.map((r) => r.value + " au " + findOrError(damageTypes, r.target).name).join(", ")}
        </Card.Body>
      )}
      {armors.map((descriptor) => (
        <CardArmor key={descriptor.id} descriptor={descriptor} />
      ))}
    </Card>
  );
}
