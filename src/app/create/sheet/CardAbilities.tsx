import { ofType } from "view";
import { CharacterProps } from "../Props";
import { Badge, Card, Stack } from "react-bootstrap";
import { ModifierTypes } from "model";

export function CardAbilities({ character }: CharacterProps) {
  const modifiers = character.getModifiers().filter(ofType(ModifierTypes.ability));
  return (
    <Card data-testid="abilities">
      <Card.Header>
        <Badge bg="primary">Pouvoirs</Badge>
      </Card.Header>
      <Card.Body className="small">
        <Stack gap={2}>
          {modifiers.length === 0 && <em>Pas de pouvoir défini</em>}
          {modifiers.map((modifier) => (
            <div key={modifier.id}>
              <strong className="me-2">{modifier.name}.</strong>
              <span className="text-muted">{modifier.description}</span>
            </div>
          ))}
        </Stack>
      </Card.Body>
    </Card>
  );
}
