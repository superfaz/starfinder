"use client";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "ui";
import { type Feature } from "view";
import FeatureComponent from "../FeatureComponent";
import { UpdateState } from "./actions";

export function ThemeTraits({ state }: Readonly<{ state: UpdateState }>) {
  const features: Feature[] = state.features;
  if (features.length === 0) {
    return null;
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Traits thématiques</h2>
      {features.map((feature) => (
        <Row key={feature.id}>
          <Col lg={1}>
            <Badge bg="secondary">Niv. {feature.level}</Badge>
          </Col>
          <Col>
            <FeatureComponent feature={feature} />
          </Col>
        </Row>
      ))}
    </Stack>
  );
}
