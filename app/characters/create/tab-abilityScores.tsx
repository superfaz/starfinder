import { ChangeEvent } from "react";
import { Badge, Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { computeAbilityScoreModifier } from "logic";
import { CharacterTabProps } from "./CharacterTabProps";

export function TabAbilityScoresSelection({ data, character, mutators }: CharacterTabProps) {
  const points = character.getRemainingAbilityScoresPoints();
  const abilityScores = character.getAbilityScores();
  const minimalAbilityScores = character.getMinimalAbilityScores();

  function handleAbilityScoreClick(abilityScoreId: string, delta: number): void {
    mutators.updateAbilityScore(abilityScoreId, delta);
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
        const score = abilityScores[abilityScore.id];
        const minimalScore = minimalAbilityScores[abilityScore.id];
        const delta = minimalScore - 10;
        const modifier = computeAbilityScoreModifier(score);
        return (
          <Form.Group key={abilityScore.id} as={Row} controlId={abilityScore.id}>
            <Form.Label column className="header">
              {abilityScore.name}
              {delta !== 0 && (
                <Badge bg={delta < 0 ? "secondary" : "primary"} className="ms-3">
                  {displayBonus(delta)}
                </Badge>
              )}
            </Form.Label>
            <Col lg={4}>
              <InputGroup>
                <Button
                  variant="outline-secondary"
                  disabled={score <= minimalScore}
                  onClick={() => handleAbilityScoreClick(abilityScore.id, -1)}
                >
                  <i className="bi-dash-lg"></i>
                </Button>
                <Form.Control
                  type="number"
                  className="text-center"
                  value={score}
                  onChange={() => {}}
                  min={minimalScore}
                  max={18}
                />
                <Button
                  variant="outline-secondary"
                  disabled={points <= 0 || score >= 18}
                  onClick={() => handleAbilityScoreClick(abilityScore.id, 1)}
                >
                  <i className="bi-plus-lg"></i>
                </Button>
              </InputGroup>
            </Col>
            <Col lg={2}>
              <div className="form-control bg-secondary text-center">{displayBonus(modifier)}</div>
            </Col>
          </Form.Group>
        );
      })}
    </Stack>
  );
}

export function TabSkillsSelection({ data, character, mutators }: CharacterTabProps) {
  const selectedRace = character.getRace();
  const selectedTheme = character.getTheme();
  const selectedClass = character.getClass();

  if (!selectedRace || !selectedTheme || !selectedClass) {
    return null;
  }

  const availableSkillRanks = character.getRemainingSkillRanksPoints();

  function handleSkillRankChange(event: ChangeEvent<HTMLInputElement>): void {
    const skillId = event.target.id;
    const checked = event.target.checked;
    mutators.updateSkillRank(skillId, checked ? 1 : -1);
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

      {character.getSkills().map((skill) => (
        <Form.Group key={skill.id} as={Row} controlId={skill.id}>
          <Form.Label column>
            {skill.definition.trainedOnly && (
              <i className="bi bi-mortarboard-fill text-secondary" title="Formation nécessaire"></i>
            )}{" "}
            {skill.definition.armorCheckPenalty && (
              <i className="bi bi-shield-shaded text-secondary" title="Le malus d’armure aux tests s’applique"></i>
            )}{" "}
            {skill.definition.name}{" "}
            {skill.definition.abilityScore &&
              "(" + findOrError(data.abilityScores, (a) => a.id === skill.definition.abilityScore).code + ")"}
          </Form.Label>
          <Col lg={2} className="pt-2 text-center">
            {skill.isClassSkill && <Form.Check type="checkbox" checked disabled />}
          </Col>
          <Col lg={2} className="pt-2 text-center">
            <Form.Check
              type="checkbox"
              id={skill.id}
              disabled={skill.ranks === 0 && availableSkillRanks <= 0}
              checked={skill.ranks > 0}
              onChange={handleSkillRankChange}
            />
          </Col>
          <Col lg={2} className="pt-2 text-center">
            {skill.bonus !== undefined && (
              <Badge bg={skill.bonus > 0 ? "primary" : "secondary"}>{displayBonus(skill.bonus)}</Badge>
            )}
            {skill.bonus === undefined && "-"}
          </Col>
        </Form.Group>
      ))}
    </Stack>
  );
}
