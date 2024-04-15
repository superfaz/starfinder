import { Badge, Card, Stack } from "react-bootstrap";
import { CharacterProps } from "../Props";

export function CardFeats({ character }: CharacterProps) {
    const feats = character.getFeats();
    return (
      <Card data-testid="sheet-feats">
        <Card.Header>
          <Badge bg="primary">Dons</Badge>
        </Card.Header>
        <Card.Body className="small">
          <Stack gap={2}>
            {feats.length === 0 && <em>Pas de don sélectionné</em>}
            {feats.map((feat) => (
              <div key={feat.target ? `${feat.id}-${feat.target}` : feat.id}>{feat.name}</div>
            ))}
          </Stack>
        </Card.Body>
      </Card>
    );
  }
  
  