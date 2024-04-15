import { Badge, Card } from "react-bootstrap";
import { CharacterProps } from "../Props";

export function CardAvatar({ character }: CharacterProps) {
  const avatar = character.getAvatar();
  return (
    <Card data-testid="avatar">
      <Card.Header>
        <Badge bg="primary">Avatar</Badge>
      </Card.Header>
      {!avatar && (
        <Card.Body className="small">
          <em>Pas de race sélectionnée</em>
        </Card.Body>
      )}
      {avatar && (
        <picture>
          <img alt="avatar" src={"/" + avatar.image} className="img-fluid" />
        </picture>
      )}
    </Card>
  );
}
