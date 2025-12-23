import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { Badge } from "ui";
import { ICharacterPresenter } from "logic";
import { ModifierTypes, ofType } from "model";

export function CardAbilities({ presenter }: Readonly<{ presenter: ICharacterPresenter }>) {
  const modifiers = presenter.getModifiers().filter(ofType(ModifierTypes.ability));
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
