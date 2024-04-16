import { useAppSelector } from "logic";
import { CharacterProps } from "../Props";
import { findOrError } from "app/helpers";
import { ValueComponent } from "./ValueComponent";
import { Badge, Card, Row } from "react-bootstrap";

export function CardArmorClass({ character }: CharacterProps) {
  const armorTypes = useAppSelector((state) => state.data.armorTypes);
  const proficiencies = character.getArmorProficiencies();
  const texts = proficiencies.map((p) => findOrError(armorTypes, p).name);
  const armorClasses = {
    energy: { value: character.getEnergyArmorClass(), label: "Classe d’armure énergétique" },
    kinetic: { value: character.getKineticArmorClass(), label: "Classe d’armure cinétique" },
    maneuvers: { value: character.getArmorClassAgainstCombatManeuvers(), label: "CA vs manoeuvres offensives" },
  };
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
      <Card.Body className="small">
        <span className="text-muted">Armure équipée :</span> aucune
      </Card.Body>
    </Card>
  );
}
