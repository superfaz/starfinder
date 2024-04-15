import { computeAbilityScoreModifier, useAppSelector } from "logic";
import { CharacterProps } from "../Props";
import { Badge, Card, Row, Stack } from "react-bootstrap";
import { ValueComponent } from "./ValueComponent";
import { displayBonus } from "app/helpers";

export function CardAbilityScores({ character }: CharacterProps) {
  const abilityScores = useAppSelector((state) => state.data.abilityScores);
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Caractérisques</Badge>
      </Card.Header>
      <Card.Body>
        <Stack direction="vertical" gap={2}>
          {[
            [0, 3],
            [3, 6],
          ].map(([min, max]) => (
            <Row key={max}>
              {abilityScores.slice(min, max).map((a) => {
                const bonus = computeAbilityScoreModifier(character.getAbilityScores()[a.id]);
                return (
                  <ValueComponent key={a.id} label={a.name} className="col">
                    <div className="position-relative">
                      <span>{character.getAbilityScores()[a.id]}</span>
                      <Badge bg={bonus > 0 ? "primary" : "secondary"} className="position-absolute end-0 me-0">
                        {displayBonus(bonus)}
                      </Badge>
                    </div>
                  </ValueComponent>
                );
              })}
            </Row>
          ))}
        </Stack>
      </Card.Body>
    </Card>
  );
}
