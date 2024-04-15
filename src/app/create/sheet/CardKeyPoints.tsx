import { Badge, Card, Row } from "react-bootstrap";
import { CharacterProps } from "../Props";
import { ValueComponent } from "./ValueComponent";

export function CardKeyPoints({ character }: CharacterProps) {
  const keyPoints = {
    stamina: { max: character.getStaminaPoints(), label: "Points d'endurance" },
    hit: { max: character.getHitPoints(), label: "Points de vie" },
    resolve: { max: character.getResolvePoints(), label: "Points de persévérance" },
  };

  return (
    <Card data-testid="keypoints">
      <Card.Header>
        <Badge bg="primary">Santé et persévérance</Badge>
      </Card.Header>
      <Card.Body className="position-relative">
        <Row>
          {Object.entries(keyPoints).map(([key, value]) => (
            <ValueComponent key={key} label={value.label} className="col" value={value.max} />
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}
