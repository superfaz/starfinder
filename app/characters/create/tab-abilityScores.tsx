import { Dispatch, SetStateAction, useEffect } from "react";
import { Badge, Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { Character, ClientComponentData } from "./types";
import { AbilityScore, Modifier } from "app/types";
import { findOrError } from "app/helpers";

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

function getAbilityScoreModifier(character: Character, abilityScoreId: string): number {
  return Math.floor((character.abilityScores[abilityScoreId] - 10) / 2);
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
        let modifier = getAbilityScoreModifier(character, abilityScore.id);
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

export function TabSkillsSelection({
  data,
  character,
  setCharacter,
}: {
  data: ClientComponentData;
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
}) {
  const selectedRace = data.races.find((r) => r.id === character.race);
  const selectedTheme = data.themes.find((t) => t.id === character.theme);
  const selectedClass = data.classes.find((c) => c.id === character.class);

  if (selectedRace === undefined || selectedTheme === undefined || selectedClass === undefined) {
    return null;
  }

  const allRaceTraits = selectedRace.traits.concat(selectedRace.secondaryTraits);
  const selectedRaceTraits = allRaceTraits.filter((t) => character.traits.includes(t.id));
  const themeTraits = selectedTheme.features;
  const characterTraits = selectedRaceTraits.concat(themeTraits);

  const modifiers = characterTraits
    .map((t) => t.modifiers)
    .flat()
    .filter((t) => t && (t.level === undefined || t.level <= 1)) as Modifier[];

  const classSkillsFromRace = modifiers
    .filter((m) => m.type === "classSkill" && m.target)
    .map((m) => m.target) as string[];
  const classSkills = selectedClass.classSkills.concat(classSkillsFromRace);

  const skillRanks =
    selectedClass.skillRank +
    getAbilityScoreModifier(character, "int") +
    modifiers
      .filter((m) => m.type === "skillRank")
      .reduce((acc, m) => acc + (typeof m.value === "number" ? m.value : 0), 0);

  const availableSkillRanks = skillRanks - Object.values(character.skillRanks).reduce((acc, v) => acc + v, 0);

  function handleSkillRankChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const skillId = event.target.id;
    const checked = event.target.checked;
    setCharacter((character) => {
      if (checked) {
        return {
          ...character,
          skillRanks: { ...character.skillRanks, [skillId]: 1 },
        };
      } else {
        const { [skillId]: _, ...skillRanks } = character.skillRanks;
        return {
          ...character,
          skillRanks,
        };
      }
    });
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Compétences</h2>

      <Row>
        <Col></Col>
        <Col lg={2} className="pt-2 text-center">
          Classe
        </Col>
        <Col lg={2} className="pt-2 text-center">
          Rang
        </Col>
        <Col lg={2} className="pt-2 text-center">
          Bonus
        </Col>
      </Row>

      <Row>
        <Col></Col>
        <Col lg={2} className="text-center"></Col>
        <Col lg={2} className="text-center">
          <Form.Control
            type="text"
            className={"text-center " + (availableSkillRanks < 0 && "bg-danger")}
            value={availableSkillRanks}
            disabled
          />
        </Col>
        <Col lg={2}></Col>
      </Row>

      {data.skills
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((skill) => {
          return (
            <Form.Group key={skill.id} as={Row} controlId={skill.id}>
              <Form.Label column>
                {skill.trainedOnly && (
                  <i className="bi bi-mortarboard-fill text-secondary" title="Formation nécessaire"></i>
                )}{" "}
                {skill.armorCheckPenalty && (
                  <i className="bi bi-shield-shaded text-secondary" title="Le malus d’armure aux tests s’applique"></i>
                )}{" "}
                {skill.name}{" "}
                {skill.abilityScore &&
                  "(" + findOrError(data.abilityScores, (a) => a.id === skill.abilityScore).code + ")"}
              </Form.Label>
              <Col lg={2} className="pt-2 text-center">
                {classSkills.includes(skill.id) && <Form.Check type="checkbox" checked disabled />}
              </Col>
              <Col lg={2} className="pt-2 text-center">
                <Form.Check
                  type="checkbox"
                  id={skill.id}
                  disabled={character.skillRanks[skill.id] === undefined && availableSkillRanks <= 0}
                  checked={character.skillRanks[skill.id] !== undefined}
                  onChange={handleSkillRankChange}
                />
              </Col>
              <Col lg={2} className="pt-2 text-center">
                <Badge bg="primary">+2</Badge>
              </Col>
            </Form.Group>
          );
        })}
    </Stack>
  );
}
