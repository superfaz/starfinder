import { useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { CharacterPresenter, retrieveClassDetails, useAppDispatch, useClassDetails } from "logic";
import { ClassFeature } from "view";
import FeatureComponent from "../FeatureComponent";
import { CharacterProps } from "../Props";
import ClassDetailsLoading from "./ClassDetailsLoading";

function Level1({ presenter, features }: { presenter: CharacterPresenter; features: ClassFeature[] }) {
  const specials = features.filter((f) => f.id.startsWith("solarian-"));
  const others = features.filter((f) => !f.id.startsWith("solarian-"));

  return (
    <Row className="mb-3">
      <Col lg={1}>
        <Badge bg="secondary">Niv. 1</Badge>
      </Col>
      {others.map((feature, index) => {
        if (index === 0) {
          return (
            <Col key={feature.id}>
              <Stack gap={4}>
                <FeatureComponent character={presenter} feature={feature} />
                {specials.map((special) => (
                  <FeatureComponent key={special.id} character={presenter} feature={special} />
                ))}
              </Stack>
            </Col>
          );
        } else {
          return (
            <Col key={feature.id}>
              <FeatureComponent character={presenter} feature={feature} />
            </Col>
          );
        }
      })}
      {[...new Array((9 - others.length) % 3)].map((_, index) => (
        <Col key={index}></Col>
      ))}
    </Row>
  );
}

function LevelN({
  level,
  presenter,
  features,
}: {
  level: number;
  presenter: CharacterPresenter;
  features: ClassFeature[];
}) {
  return (
    <Row className="mb-3">
      <Col lg={1}>
        <Badge bg="secondary">Niv. {level}</Badge>
      </Col>
      {features.map((feature) => (
        <Col key={feature.id}>
          <FeatureComponent character={presenter} feature={feature} />
        </Col>
      ))}
      {[...new Array((9 - features.length) % 3)].map((_, index) => (
        <Col key={index}></Col>
      ))}
    </Row>
  );
}

export default function ClassDetailsGeneric({ character, classId }: CharacterProps & { classId: string }) {
  const classDetails = useClassDetails(classId);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails(classId));
    }
  }, [dispatch, classDetails, classId]);

  if (!classDetails) {
    return <ClassDetailsLoading />;
  }

  const features = character.getClassFeatures();
  const levels = features
    .map((f) => f.level)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a - b);

  return levels.map((level) => {
    const levelFeatures = features.filter((s) => s.level === level);

    if (level === 1) {
      return <Level1 key={level} presenter={character} features={levelFeatures} />;
    } else {
      return <LevelN key={level} level={level} presenter={character} features={levelFeatures} />;
    }
  });
}
