import { ReactNode } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Badge } from "ui";
import FeatureComponent from "../FeatureComponent";
import { useClassDetails } from "../helpers-client";
import { CharacterProps } from "../Props";
import ClassDetailsLoading from "./ClassDetailsLoading";

export default function ClassDetailsGeneric({ presenter, classId }: CharacterProps & { classId: string }): ReactNode {
  const classDetails = useClassDetails(classId);

  if (!classDetails) {
    return <ClassDetailsLoading />;
  }

  const features = presenter.getClassFeatures();
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
