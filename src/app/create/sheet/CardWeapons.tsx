import { Badge, Card } from "react-bootstrap";
import { CharacterProps } from "../Props";
import { useAppSelector } from "logic";
import { findOrError } from "app/helpers";

export function CardWeapons({ character }: CharacterProps) {
  const weaponTypes = useAppSelector((state) => state.data.weaponTypes);
  const proficiencies = character.getWeaponProficiencies();
  const texts = proficiencies.map((p) => findOrError(weaponTypes, p).name);
  return (
    <Card data-testid="weapons">
      <Card.Header>
        <Badge bg="primary">Armes</Badge>
      </Card.Header>
      <Card.Body className="position-relative small py-2">
        {texts.length > 0 && <span>Formations: {texts.join(", ")}</span>}
      </Card.Body>
      <Card.Body className="position-relative">test</Card.Body>
    </Card>
  );
}
