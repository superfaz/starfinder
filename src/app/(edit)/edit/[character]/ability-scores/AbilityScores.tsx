"use client";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { displayBonus } from "app/helpers";
import { computeAbilityScoreModifier, mutators, useAppDispatch, useAppSelector } from "logic";
import { useCharacterPresenter } from "../helpers-client";

export function AbilityScores() {
  const presenter = useCharacterPresenter();
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  if (presenter.getClass() === null) {
    return null;
  }

  if (data === null) {
    return <div>Loading...</div>;
  }

  const points = presenter.getRemainingAbilityScoresPoints();
  const abilityScores = presenter.getAbilityScores();
  const minimalAbilityScores = presenter.getMinimalAbilityScores();

  const primaryAbilityScore = presenter.getPrimaryAbilityScore();
  const secondaryAbilityScores = presenter.getSecondaryAbilityScores();

  function handleAbilityScoreClick(abilityScoreId: string, delta: number): void {
    dispatch(mutators.updateAbilityScore({ id: abilityScoreId, delta }));
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3" data-testid="ability-scores">
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
        <Col xs={4}>
          <Form.Control type="number" className="text-center" value={points} disabled />
        </Col>
        <Col xs={2} className="pt-2 text-center">
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
              {primaryAbilityScore === abilityScore.id && (
                <i className="bi bi-star-fill text-gold" title="Caractéristique principale"></i>
              )}
              {secondaryAbilityScores.includes(abilityScore.id) && (
                <i className="bi bi-star-half text-gold" title="Caractéristique secondaire"></i>
              )}
              {primaryAbilityScore !== abilityScore.id && !secondaryAbilityScores.includes(abilityScore.id) && (
                <i className="bi bi-empty"></i>
              )}
              <span className="ms-1">{abilityScore.name}</span>
              {delta !== 0 && (
                <Badge bg={delta < 0 ? "secondary" : "primary"} className="ms-3">
                  {displayBonus(delta)}
                </Badge>
              )}
            </Form.Label>
            <Col xs={4}>
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
            <Col xs={2}>
              <div className="form-control bg-secondary text-center">{displayBonus(modifier)}</div>
            </Col>
          </Form.Group>
        );
      })}
    </Stack>
  );
}
