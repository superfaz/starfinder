import { useEffect } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { ClassEnvoy, FeatureTemplate } from "model";
import { Templater, cleanEvolutions, retrieveClassDetails, useAppDispatch, useClassDetails } from "logic";
import FeatureComponent from "../FeatureComponent";
import { CharacterProps } from "../Props";

export default function EnvoyClassDetails({ character }: CharacterProps) {
  const classDetails = useClassDetails<ClassEnvoy>("envoy");
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails("envoy"));
    }
  }, [dispatch, classDetails]);

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const features: FeatureTemplate[] = classDetails.features;
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
        .map((template) => {
          const evolutions = template.evolutions ?? {};
          const templater = new Templater(cleanEvolutions(evolutions)[level] ?? {});
          const feature = templater.convertFeature(template);
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
