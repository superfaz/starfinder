import dynamic from "next/dynamic";
import { ChangeEvent } from "react";
import { Badge, Col, Form, Row, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { Feature } from "view";
import FeatureComponent from "../FeatureComponent";
import { CharacterProps } from "../Props";

const LazyThemeNoneEditor = dynamic(() => import("../themes/ThemeNoneEditor"));
const LazyThemeScholarEditor = dynamic(() => import("../themes/ThemeScholarEditor"));

export function ThemeSelection({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  const selectedTheme = character.getTheme();

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateTheme(id));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Thème</h2>
      <Form.FloatingLabel controlId="theme" label="Thème">
        <Form.Select value={selectedTheme?.id ?? ""} onChange={handleThemeChange}>
          {selectedTheme === null && <option value=""></option>}
          {data.themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedTheme && !character.hasNoTheme() && (
        <Stack direction="horizontal" className="right">
          {Object.entries(selectedTheme.abilityScores).map(
            ([key, value]) =>
              value && (
                <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                  {findOrError(data.abilityScores, key).code}
                  {displayBonus(value)}
                </Badge>
              )
          )}
        </Stack>
      )}
      {selectedTheme && <p className="text-muted">{selectedTheme.description}</p>}
      {character.hasNoTheme() && <LazyThemeNoneEditor character={character} />}
      {character.isScholar() && <LazyThemeScholarEditor character={character} />}
    </Stack>
  );
}

export function ThemeTraits({ character }: CharacterProps) {
  const features: Feature[] = character.getThemeFeatures();

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Traits thématiques</h2>
      {features.map((feature) => (
        <Row key={feature.id}>
          <Col lg={1}>
            <Badge bg="secondary">Niv. {feature.level}</Badge>
          </Col>
          <Col>
            <FeatureComponent character={character} feature={feature} />
          </Col>
        </Row>
      ))}
    </Stack>
  );
}
