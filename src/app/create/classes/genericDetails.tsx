import { useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { retrieveClassDetails, useAppDispatch, useClassDetails } from "logic";
import FeatureComponent from "../FeatureComponent";
import { CharacterProps } from "../Props";

export default function EnvoyClassDetails({ character, classId }: CharacterProps & { classId: string }) {
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

  return levels.map((level) => (
    <Row key={level} className="mb-3">
      <Col lg={1}>
        <Badge bg="secondary">Niv. {level}</Badge>
      </Col>
      {features
        .filter((s) => s.level === level)
        .map((feature) => {
          return (
            <Col key={feature.id}>
              <FeatureComponent character={character} feature={feature} />
            </Col>
          );
        })}
      {[...new Array(3 - Math.min(3, features.filter((s) => s.level === level).length))].map((_, index) => (
        <Col key={index}></Col>
      ))}
    </Row>
  ));
}
