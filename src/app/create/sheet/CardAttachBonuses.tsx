import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { Badge } from "app/components";
import { displayBonus } from "app/helpers";
import { CharacterProps } from "../Props";
import { ValueComponent } from "./ValueComponent";

export function CardAttackBonuses({ character }: CharacterProps) {
  const attackBonuses = character.getAttackBonuses();
  return (
    <Card data-testid="attackBonuses">
      <Card.Header>
        <Badge bg="primary">Bonus d&apos;attaque</Badge>
      </Card.Header>
      <Card.Body className="position-relative">
        {!attackBonuses && (
          <div className="small">
            <em>Pas de classe sélectionnée</em>
          </div>
        )}
        {attackBonuses && (
          <Row>
            <ValueComponent label="Bonus de base à l'attaque" className="col-12 mb-2">
              <Badge bg={attackBonuses.base > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                {displayBonus(attackBonuses.base)}
              </Badge>
            </ValueComponent>
            <ValueComponent label="Attaque au corps à corps" className="col">
              <Badge bg={attackBonuses.melee > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                {displayBonus(attackBonuses.melee)}
              </Badge>
            </ValueComponent>
            <ValueComponent label="Attaque à distance" className="col">
              <Badge bg={attackBonuses.ranged > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                {displayBonus(attackBonuses.ranged)}
              </Badge>
            </ValueComponent>
            <ValueComponent label="Attaque de lancer" className="col">
              <Badge bg={attackBonuses.thrown > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                {displayBonus(attackBonuses.thrown)}
              </Badge>
            </ValueComponent>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}
