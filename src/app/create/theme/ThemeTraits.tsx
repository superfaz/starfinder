"use client";

import { Badge, Col, Row, Stack } from "react-bootstrap";
import { Feature } from "view";
import FeatureComponent from "../FeatureComponent";
import { useCharacterPresenter } from "../helpers";

export function ThemeTraits() {
  const presenter = useCharacterPresenter();
  const features: Feature[] = presenter.getThemeFeatures();
  return (
    <Stack direction="vertical" gap={2}>
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
