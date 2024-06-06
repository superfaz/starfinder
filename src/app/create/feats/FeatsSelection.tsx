"use client";

import { useState } from "react";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import type { FeatTemplate } from "model";
import { hasDescription } from "model";
import { FeatPresenter, FeatTemplateExtended, useAppSelector } from "logic";
import { FeatTemplateComponent } from "./FeatTemplateComponent";
import { useCharacterPresenter } from "../helpers";
import { Stack } from "react-bootstrap";

export function FeatsSelection() {
  const presenter = useCharacterPresenter();
  const data = useAppSelector((state) => state.data);
  const featPresenter = new FeatPresenter(data, presenter);
  const allFeats = featPresenter.getFeatTemplates();

  const [category, setCategory] = useState<"general" | "combat" | "all">("all");
  const [prerequisite, setPrerequisite] = useState<"available" | "blocked" | "all">("available");
  const [search, setSearch] = useState<string>("");

  let categoryFilter: (feat: FeatTemplate) => boolean;
  if (category === "combat") {
    categoryFilter = (feat) => feat.combatFeat;
  } else if (category === "general") {
    categoryFilter = (feat) => !feat.combatFeat;
  } else {
    categoryFilter = () => true;
  }

  let prerequisiteFilter: (feat: FeatTemplateExtended) => boolean;
  if (prerequisite === "available") {
    prerequisiteFilter = (feat) => feat.available;
  } else if (prerequisite === "blocked") {
    prerequisiteFilter = (feat) => !feat.available;
  } else {
    prerequisiteFilter = () => true;
  }

  let searchFilter: (feat: FeatTemplate) => boolean;
  if (search.trim() === "") {
    searchFilter = () => true;
  } else {
    const searchLower = search.trim().toLowerCase();
    searchFilter = (feat) =>
      feat.name.toLowerCase().includes(searchLower) ||
      feat.description?.toLowerCase().includes(searchLower) ||
      feat.modifiers.some(
        (modifier) => hasDescription(modifier) && modifier.description.toLowerCase().includes(searchLower)
      );
  }

  const displayedFeats = allFeats
    .filter((f) => f.visible)
    .filter(categoryFilter)
    .filter(prerequisiteFilter)
    .filter(searchFilter);

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Dons disponibles</h2>

      <Row className="mb-2 align-items-center">
        <Col lg="auto" className="d-none d-lg-block ms-3">
          Filtres:
        </Col>
        <Col lg="auto" className="mb-1 mb-lg-0">
          <ToggleButtonGroup type="radio" name="type" value={category} onChange={setCategory} className="w-100">
            <ToggleButton id="type-general" value="general" variant="outline-secondary">
              Dons généraux
            </ToggleButton>
            <ToggleButton id="type-all" value="all" variant="outline-secondary">
              Tous
            </ToggleButton>
            <ToggleButton id="type-combat" value="combat" variant="outline-secondary">
              Dons de combat
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
        <Col lg="auto" className="mb-1 mb-lg-0">
          <ToggleButtonGroup
            type="radio"
            name="prerequisite"
            value={prerequisite}
            onChange={setPrerequisite}
            className="w-100"
          >
            <ToggleButton id="prerequisite-available" value="available" variant="outline-secondary">
              Disponibles
            </ToggleButton>
            <ToggleButton id="prerequisite-all" value="all" variant="outline-secondary">
              Tous
            </ToggleButton>
            <ToggleButton id="prerequisite-blocked" value="blocked" variant="outline-secondary">
              Conditions non remplies
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
        <Col className="mb-1 mb-lg-0">
          <FormControl
            type="search"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <Row data-testid="feats" className="row-cols-1 row-cols-lg-2 row-cols-xxl-3">
        {displayedFeats.map((template) => (
          <Col key={template.id} className="mb-4">
            <FeatTemplateComponent presenter={presenter} template={template} />
          </Col>
        ))}
      </Row>
    </Stack>
  );
}
