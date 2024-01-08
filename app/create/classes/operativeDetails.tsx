import { useEffect } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { FeatureTemplate } from "model";
import { Templater, cleanEvolutions } from "logic";
import FeatureComponent from "../FeatureComponent";
import { CharacterProps } from "../Props";
import { retrieveClassDetails, useAppDispatch, useAppSelector } from "../store";

export default function OperativeClassDetails({ character }: CharacterProps) {
  const operativeData = useAppSelector((state) => state.classesDetails.operative);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!operativeData) {
      dispatch(retrieveClassDetails("operative"));
    }
  }, [dispatch, operativeData]);

  if (!operativeData) {
    return <p>Loading...</p>;
  }

  const selectedSpecialization = operativeData.specializations.find(
    (s) => s.id === character.getOperativeSpecialization()
  );
  if (!selectedSpecialization) {
    return null;
  }

  const classFeatures: FeatureTemplate[] = operativeData.features;
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
