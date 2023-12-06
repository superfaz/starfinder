import { Dispatch, SetStateAction, use, useEffect } from "react";
import { Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { Character, ClientComponentData } from "./types";
import { AbilityScore } from "app/types";

function getMinimalAbilityScoreFor(
  data: ClientComponentData,
  character: Character,
  abilityScore: AbilityScore
): number {
  const selectedRace = data.races.find((r) => r.id === character.race) || null;
  const selectedVariant = selectedRace?.variants.find((v) => v.id === character.raceVariant) || null;
  const selectedTheme = data.themes.find((r) => r.id === character.theme) || null;

  let score = 10;

  if (selectedVariant) {
    score += selectedVariant.abilityScores[abilityScore.id] || 0;
  }

  if (selectedTheme) {
    score += selectedTheme.abilityScores[abilityScore.id] || 0;
  }

  if (
    // Race: Human and Variant: Standard
    character.raceVariant === "humans-standard" &&
    character.raceOptions !== undefined &&
    abilityScore.id === character.raceOptions.humanBonus
  ) {
    score += 2;
  }

  if (
    // Theme: No Theme
    character.theme === "e1a9a6ad-0c95-4f31-a692-3327c77bb53f" &&
    character.themeOptions !== undefined &&
    abilityScore.id === character.themeOptions.noThemeAbility
  ) {
    score += 1;
  }

  return score;
}

function computeRemainingPoints(data: ClientComponentData, character: Character): number {
  let points = 10;
  data.abilityScores.forEach((abilityScore) => {
    let minimalScore = getMinimalAbilityScoreFor(data, character, abilityScore);
    if (character.abilityScores[abilityScore.id] > minimalScore) {
      points -= character.abilityScores[abilityScore.id] - minimalScore;
    }
  });

  return points;
}

export function TabAbilityScoresSelection({
  data,
  character,
  setCharacter,
}: {
  data: ClientComponentData;
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
}) {
  useEffect(() => {
    data.abilityScores.forEach((abilityScore) => {
      let minimalScore = getMinimalAbilityScoreFor(data, character, abilityScore);
      if (character.abilityScores[abilityScore.id] < minimalScore) {
        setCharacter((character) => {
          return {
            ...character,
            abilityScores: { ...character.abilityScores, [abilityScore.id]: minimalScore },
          };
        });
      }
    });
  }, [data, character, setCharacter]);

  let points = computeRemainingPoints(data, character);

  function handleAbilityScoreClick(abilityScoreId: string, delta: number): void {
    setCharacter({
      ...character,
      abilityScores: { ...character.abilityScores, [abilityScoreId]: character.abilityScores[abilityScoreId] + delta },
    });
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Caractéristiques</h2>
      <Form.FloatingLabel controlId="abilityScoresMethod" label="Méthode de génération">
        <Form.Select>
          <option value="buy">Achat (méthode conseillée)</option>
          <option value="quick" disabled>
            Déterminaton rapide
          </option>
          <option value="random" disabled>
            Déterminaton aléatoire
          </option>
        </Form.Select>
      </Form.FloatingLabel>
      <Form.Group as={Row} controlId="abilityScoresPoints">
        <Form.Label column></Form.Label>
        <Col lg={4}>
          <Form.Control type="number" className="text-center" value={points} disabled />
        </Col>
        <Col lg={2} className="pt-2 text-center">
          Mod.
        </Col>
      </Form.Group>
      {data.abilityScores.map((abilityScore) => {
        let minimalScore = getMinimalAbilityScoreFor(data, character, abilityScore);
        let delta = minimalScore - 10;
        let modifier = Math.floor((character.abilityScores[abilityScore.id] - 10) / 2);
        return (
          <Form.Group key={abilityScore.id} as={Row} controlId={abilityScore.id}>
            <Form.Label column className="header">
              {abilityScore.name}
              {delta < 0 && <span className="badge ms-3 bg-secondary">{delta}</span>}
              {delta > 0 && <span className="badge ms-3 bg-primary">+{delta}</span>}
            </Form.Label>
            <Col lg={4}>
              <InputGroup>
                <Button
                  variant="outline-secondary"
                  disabled={character.abilityScores[abilityScore.id] <= minimalScore}
                  onClick={() => handleAbilityScoreClick(abilityScore.id, -1)}
                >
                  <i className="bi-dash-lg"></i>
                </Button>
                <Form.Control
                  type="number"
                  className="text-center"
                  value={character.abilityScores[abilityScore.id] || minimalScore}
                  onChange={() => {}}
                  min={minimalScore}
                  max={4}
                />
                <Button
                  variant="outline-secondary"
                  disabled={points <= 0 || character.abilityScores[abilityScore.id] >= 18}
                  onClick={() => handleAbilityScoreClick(abilityScore.id, 1)}
                >
                  <i className="bi-plus-lg"></i>
                </Button>
              </InputGroup>
            </Col>
            <Col lg={2}>
              <div className="form-control bg-secondary text-center">{modifier > 0 ? "+" + modifier : modifier}</div>
            </Col>
          </Form.Group>
        );
      })}
    </Stack>
  );
}

export function TabSkillsSelection({ data }: { data: ClientComponentData }) {
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Compétences</h2>
      {data.skills.map((skill) => {
        return (
          <Form.Group key={skill.id} as={Row} controlId={skill.id}>
            <Form.Label column>{skill.name}</Form.Label>
          </Form.Group>
        );
      })}
    </Stack>
  );
}
