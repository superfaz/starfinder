import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { Badge } from "ui";
import { CharacterProps } from "../Props";
import { ValueComponent } from "./ValueComponent";

export function CardKeyPoints({ presenter }: CharacterProps) {
  const keyPoints = {
    stamina: { max: presenter.getStaminaPoints(), label: "Points d'endurance" },
    hit: { max: presenter.getHitPoints(), label: "Points de vie" },
    resolve: { max: presenter.getResolvePoints(), label: "Points de persévérance" },
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
