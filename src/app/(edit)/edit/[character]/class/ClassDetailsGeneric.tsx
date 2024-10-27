import { ReactNode } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Badge } from "ui";
import { ClassFeature } from "view";
import FeatureComponent from "../FeatureComponent";

export default function ClassDetailsGeneric({ features }: Readonly<{ features: ClassFeature[] }>): ReactNode {
  const levels = features
    .map((f) => f.level)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a - b);

  return levels.map((level) => {
    const levelFeatures = features.filter((s) => s.level === level);
    return (
      <Row key={level} className="mb-3">
        <Col lg={1}>
          <Badge bg="secondary">Niv. {level}</Badge>
        </Col>
        {levelFeatures.map((feature) => (
          <Col key={feature.id}>
            <FeatureComponent feature={feature} />
          </Col>
        ))}
        {[...new Array((9 - levelFeatures.length) % 3)].map((_, index) => (
          <Col key={index}></Col>
        ))}
      </Row>
    );
  });
}
