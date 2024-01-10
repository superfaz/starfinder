import { useEffect } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { ClassOperative, FeatureTemplate } from "model";
import { Templater, cleanEvolutions, retrieveClassDetails, useAppDispatch, useClassDetails } from "logic";
import FeatureComponent from "../FeatureComponent";
import { CharacterProps } from "../Props";

export default function OperativeClassDetails({ character }: CharacterProps) {
  const classDetails = useClassDetails<ClassOperative>("operative");
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails("operative"));
    }
  }, [dispatch, classDetails]);

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const selectedSpecialization = classDetails.specializations.find(
    (s) => s.id === character.getOperativeSpecialization()
  );
  if (!selectedSpecialization) {
    return null;
  }

  const classFeatures: FeatureTemplate[] = classDetails.features;
  const specializationFeatures: FeatureTemplate[] = selectedSpecialization.features;
  const features: FeatureTemplate[] = classFeatures.concat(specializationFeatures);
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
          const evolutions = cleanEvolutions(template.evolutions) ?? {};
          const templater = new Templater({
            ...(selectedSpecialization?.variables ?? {}),
            ...(evolutions[level] ?? {}),
          });
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
