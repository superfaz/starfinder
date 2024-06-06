"use client";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { Feature } from "view";
import FeatureComponent from "../FeatureComponent";
import { useCharacterPresenter } from "../helpers";

export function ThemeTraits() {
  const presenter = useCharacterPresenter();
  const features: Feature[] = presenter.getThemeFeatures();
  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Traits thématiques</h2>
      {features.map((feature) => (
        <Row key={feature.id}>
          <Col lg={1}>
            <Badge bg="secondary">Niv. {feature.level}</Badge>
          </Col>
          <Col>
            <FeatureComponent character={presenter} feature={feature} />
          </Col>
        </Row>
      ))}
    </Stack>
  );
}
