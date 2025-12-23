import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "ui";
import { displayBonus } from "app/helpers";
import { ICharacterPresenter, useAppSelector } from "logic";
import { ModifierTypes, ofType } from "model";
import { ValueComponent } from "./ValueComponent";

export function CardSavingThrows({ presenter }: Readonly<{ presenter: ICharacterPresenter }>) {
  const savingThrows = useAppSelector((state) => state.data.savingThrows);
  const modifiers = presenter.getModifiers().filter(ofType(ModifierTypes.savingThrow));

  return (
    <Card data-testid="savingThrows">
      <Card.Header>
        <Badge bg="primary">Jets de sauvegarde</Badge>
      </Card.Header>
      <Card.Body className="position-relative">
        <Row>
          {savingThrows.map((savingThrow) => {
            const bonus = presenter.getSavingThrowBonus(savingThrow);
            return (
              <ValueComponent key={savingThrow.id} label={savingThrow.name} className="col">
                {bonus === undefined && <Badge bg="secondary">-</Badge>}
                {bonus !== undefined && (
                  <Badge bg={bonus > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                    {displayBonus(bonus)}
                  </Badge>
                )}
              </ValueComponent>
            );
          })}
        </Row>
      </Card.Body>
      {modifiers.length > 0 && (
        <Card.Footer className="small">
          <Stack gap={2}>
            {modifiers.map((modifier) => (
              <div key={modifier.id}>
                <strong className="me-2">{modifier.name}.</strong>
                <span className="text-muted">{modifier.description}</span>
              </div>
            ))}
          </Stack>
        </Card.Footer>
      )}
    </Card>
  );
}
