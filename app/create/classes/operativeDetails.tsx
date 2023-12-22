import { Badge, Col, Row } from "react-bootstrap";
import operativeData from "data/class-operative.json";
import { FeatureTemplate } from "model";
import { CharacterPresenter, Templater } from "logic";
import FeatureComponent from "../FeatureComponent";

export default function OperativeClassDetails({ character }: { character: CharacterPresenter }) {
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
        .map((template, index) => {
          const evolutions = template.evolutions ?? {};
          const templater = new Templater({
            ...(selectedSpecialization?.variables ?? {}),
            ...(evolutions[level] ?? {}),
          });
          const feature = templater.convertFeature(template);
          return (
            <Col key={index}>
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
