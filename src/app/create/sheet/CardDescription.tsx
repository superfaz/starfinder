import Card from "react-bootstrap/Card";
import { Badge } from "app/components";
import { CharacterProps } from "../Props";

export function CardDescription({ character }: CharacterProps) {
  const description = character.getDescription();
  return (
    <Card data-testid="description">
      <Card.Header>
        <Badge bg="primary">Biographie & Description</Badge>
      </Card.Header>
      <Card.Body className="small">
        {!description && <em>Pas de description définie</em>}
        {description}
      </Card.Body>
    </Card>
  );
}
