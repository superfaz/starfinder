import { Badge, Card, Col, Row } from "react-bootstrap";
import { Context } from "../types";
import operativeData from "data/class-operative.json";
import ModifierComponent, { replace } from "../ModifierComponent";
import { FeatureTemplate } from "model";
import { CharacterPresenter } from "logic";

const categories: Record<string, string> = {
  ex: "EXT",
  ma: "MAG",
  su: "SUR",
};

export default function OperativeClassDetails({
  character,
  context,
}: {
  character: CharacterPresenter;
  context: Context;
}) {
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
        .map((feature, index) => {
          const evolutions = feature.evolutions || {};
          const localContext = {
            ...context,
            ...(selectedSpecialization?.variables || {}),
            ...(evolutions[level] || {}),
          };
          return (
            <Col key={index}>
              <Card>
                <Card.Header>
                  {feature.name} {feature.category && `(${categories[feature.category]})`}
                </Card.Header>
                <Card.Body>
                  {feature.description && <p className="text-muted">{replace(localContext, feature.description)}</p>}
                  {feature.modifiers &&
                    feature.modifiers.map((modifier) => (
                      <ModifierComponent key={modifier.id} modifier={modifier} context={localContext} />
                    ))}
                </Card.Body>
                {feature.evolutions && (
                  <Card.Footer>
                    {Object.entries(feature.evolutions).map(([level, values]) => {
                      if (values) {
                        return (
                          <div key={level}>
                            <Badge bg="secondary">{level}</Badge> {values.name && <strong>{values.name}</strong>}{" "}
                            {Object.entries(values)
                              .filter(([key]) => key !== "name")
                              .map(([key, value]) => `${(operativeData.labels as Record<string, string>)[key]}${value}`)
                              .join(", ")}
                          </div>
                        );
                      } else {
                        return (
                          <Badge key={level} bg="secondary">
                            {level}
                          </Badge>
                        );
                      }
                    })}
                  </Card.Footer>
                )}
              </Card>
            </Col>
          );
        })}
      {[...new Array(3 - Math.min(3, features.filter((s) => s.level === level).length))].map((_, index) => (
        <Col key={index}></Col>
      ))}
    </Row>
  ));
}
