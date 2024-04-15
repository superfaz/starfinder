import { Badge, Card, Col, Row } from "react-bootstrap";
import { CharacterProps } from "../Props";
import { displayBonus } from "app/helpers";

export function CardInitiative({ character }: CharacterProps) {
  const initiative = character.getInitiative();
  return (
    <Card data-testid="initiative">
      <Card.Header>
        <Row>
          <Col xs="auto">
            <Badge bg="primary">Initiative</Badge>
          </Col>
          <Col className="text-end pe-1">
            <Badge bg={initiative > 0 ? "primary" : "secondary"}>{displayBonus(initiative)}</Badge>
          </Col>
        </Row>
      </Card.Header>
    </Card>
  );
}
