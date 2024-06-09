import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Badge } from "app/components";
import { displayBonus } from "app/helpers";
import { CharacterProps } from "../Props";

export function CardInitiative({ presenter }: CharacterProps) {
  const initiative = presenter.getInitiative();
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
