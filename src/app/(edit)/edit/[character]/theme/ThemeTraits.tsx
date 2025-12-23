"use client";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "ui";
import { type Feature } from "view";
import FeatureComponent from "../FeatureComponent";
import { UpdateState } from "./actions";
import { Alert } from "react-bootstrap";

export function ThemeTraits({ state }: Readonly<{ state: UpdateState }>) {
  const features: Feature[] = state.features;

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Traits thématiques</h2>
      {features.length === 0 && (
        <Alert variant="info" className="d-flex align-items-center">
          <i className="bi bi-info-circle-fill flex-shrink-0 me-3"></i>
          <div>
            <i>Sélectionnez un thème pour afficher ses traits.</i>
          </div>
        </Alert>
      )}
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
