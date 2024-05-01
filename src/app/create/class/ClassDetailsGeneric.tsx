import { useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { retrieveClassDetails, useAppDispatch, useClassDetails } from "logic";
import FeatureComponent from "../FeatureComponent";
import { CharacterProps } from "../Props";

export default function ClassDetailsGeneric({ character, classId }: CharacterProps & { classId: string }) {
  const classDetails = useClassDetails(classId);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails(classId));
    }
  }, [dispatch, classDetails, classId]);

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const features = character.getClassFeatures();
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
            <FeatureComponent character={character} feature={feature} />
          </Col>
        ))}
        {[...new Array((9-levelFeatures.length) % 3)].map((_, index) => (
          <Col key={index}></Col>
        ))}
      </Row>
    );
  });
}
