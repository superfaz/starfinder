import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "ui";
import { displayBonus } from "app/helpers";
import { ICharacterPresenter, computeAbilityScoreModifier, useAppSelector } from "logic";
import { ValueComponent } from "./ValueComponent";

export function CardAbilityScores({ presenter }: Readonly<{ presenter: ICharacterPresenter }>) {
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
                const score = presenter.getAbilityScores()[a.id];
                const bonus = computeAbilityScoreModifier(score ?? 10);
                return (
                  <ValueComponent key={a.id} label={a.name} className="col">
                    <div className="position-relative">
                      <span>{score ?? "-"}</span>
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
