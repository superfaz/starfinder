import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { displayBonus } from "app/helpers";
import { useAppSelector } from "logic";
import { ModifierTypes } from "model";
import { ofType } from "view";
import { ValueComponent } from "./ValueComponent";
import { CharacterProps } from "../Props";

export function CardSavingThrows({ character }: CharacterProps) {
  const savingThrows = useAppSelector((state) => state.data.savingThrows);
  const selectedClass = character.getClass();
  const modifiers = character.getModifiers().filter(ofType(ModifierTypes.savingThrow));

  return (
    <Card data-testid="savingThrows">
      <Card.Header>
        <Badge bg="primary">Jets de sauvegarde</Badge>
      </Card.Header>
      <Card.Body className="position-relative">
        <Row>
          {!selectedClass && (
            <div className="small">
              <em>Pas de classe sélectionnée</em>
            </div>
          )}
          {selectedClass &&
            savingThrows.map((savingThrow) => {
              const bonus = character.getSavingThrowBonus(savingThrow);
              return (
                bonus !== undefined && (
                  <ValueComponent key={savingThrow.id} label={savingThrow.name} className="col">
                    <Badge bg={bonus > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                      {displayBonus(bonus)}
                    </Badge>
                  </ValueComponent>
                )
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
