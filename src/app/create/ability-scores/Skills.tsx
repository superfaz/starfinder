"use client";

import { ChangeEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { displayBonus, findOrError } from "app/helpers";
import { SkillPresenter, mutators, useAppDispatch, useAppSelector } from "logic";
import { useCharacterPresenter } from "../helpers";
import { ProfessionSkills } from "./ProfessionSkills";

type SkillProps = Readonly<{
  skill: SkillPresenter;
  availableSkillRanks: number;
  onCheck: (event: ChangeEvent<HTMLInputElement>) => void;
}>;

function Skill({ skill, availableSkillRanks, onCheck }: SkillProps) {
  const dispatch = useAppDispatch();
  const bonusCategories = useAppSelector((state) => state.data.bonusCategories);
  const [isOpen, setIsOpen] = useState(false);

  function handleRemove(id: string): void {
    dispatch(mutators.removeProfessionSkill(id));
  }

  function toggleOpen(): void {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <Form.Group as={Row} controlId={skill.id} data-testid={skill.id}>
        <Form.Label column>
          {skill.definition.id === "prof" && (
            <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleRemove(skill.id)}>
              <i className="bi bi-x-lg"></i>
            </Button>
          )}
          <span className="me-1">{skill.fullName}</span>
          {skill.definition.trainedOnly && (
            <i className="bi bi-mortarboard-fill text-secondary me-1" title="Formation nécessaire"></i>
          )}
          {skill.definition.armorCheckPenalty && (
            <i className="bi bi-shield-shaded text-secondary me-1" title="Le malus d’armure aux tests s’applique"></i>
          )}
        </Form.Label>
        <Col xs={2} className="pt-2 text-center">
          {skill.isClassSkill && (
            <Form.Check
              type="checkbox"
              id={skill.id + "-class"}
              checked
              disabled
              aria-label={skill.fullName + " - Compétence de classe"}
            />
          )}
        </Col>
        <Col xs={2} className="pt-2 text-center">
          {skill.rankForced && <Form.Check type="checkbox" id={skill.id} disabled={true} checked={true} />}
          {!skill.rankForced && (
            <Form.Check
              type="checkbox"
              id={skill.id}
              disabled={skill.ranks === 0 && availableSkillRanks <= 0}
              checked={skill.ranks > 0}
              onChange={onCheck}
            />
          )}
        </Col>
        <Col xs={2} className="pt-2 text-center" onClick={toggleOpen}>
          {skill.bonus !== undefined && (
            <Badge bg={skill.bonus > 0 ? "primary" : "secondary"}>{displayBonus(skill.bonus)}</Badge>
          )}
          {skill.bonus === undefined && "-"}
        </Col>
      </Form.Group>
      <Card hidden={!isOpen}>
        <Card.Body>
          {skill.modifiers.map((modifier, index) => (
            <Row key={index} className={modifier.applied ? undefined : "text-decoration-line-through"}>
              <Col className="text-end">{modifier.source}</Col>
              <Col>
                <Badge bg={modifier.value > 0 ? "primary" : "secondary"}>{displayBonus(modifier.value)}</Badge>
                <span className="text-muted"> ({findOrError(bonusCategories, modifier.category).name})</span>
              </Col>
            </Row>
          ))}
        </Card.Body>
      </Card>
    </>
  );
}

export function Skills() {
  const presenter = useCharacterPresenter();
  const dispatch = useAppDispatch();
  const [isProfessionOpen, setIsProfessionOpen] = useState(false);

  const selectedRace = presenter.getRace();
  const selectedTheme = presenter.getTheme();
  const selectedClass = presenter.getClass();

  if (!selectedRace || !selectedTheme || !selectedClass) {
    return null;
  }

  const availableSkillRanks = presenter.getRemainingSkillRanksPoints();

  function handleSkillRankChange(event: ChangeEvent<HTMLInputElement>): void {
    const skillId = event.target.id;
    const checked = event.target.checked;
    dispatch(mutators.updateSkillRank({ id: skillId, delta: checked ? 1 : -1 }));
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Compétences</h2>

      <Row>
        <Col xs={6} className="mt-auto mb-auto text-center">
          <Button hidden={isProfessionOpen} onClick={() => setIsProfessionOpen(true)}>
            Ajouter une profession
          </Button>
        </Col>
        <Col xs={2} className="pt-2 text-center">
          Classe
        </Col>
        <Col xs={2} className="pt-2 text-center">
          <div className="mb-2">Rang</div>
          <Form.Control
            title="Rangs de compétence à distribuer"
            type="text"
            className={"text-center " + (availableSkillRanks < 0 && "bg-danger")}
            value={availableSkillRanks}
            disabled
          />
        </Col>
        <Col xs={2} className="pt-2 text-center">
          Bonus
        </Col>
      </Row>

      <div hidden={!isProfessionOpen}>
        <ProfessionSkills onClose={() => setIsProfessionOpen(false)} />
      </div>

      {presenter.getProfessionSkills().map((skill) => (
        <Skill key={skill.id} skill={skill} availableSkillRanks={availableSkillRanks} onCheck={handleSkillRankChange} />
      ))}

      {presenter.getProfessionSkills().length > 0 && <hr />}

      {presenter.getGenericSkills().map((skill) => (
        <Skill key={skill.id} skill={skill} availableSkillRanks={availableSkillRanks} onCheck={handleSkillRankChange} />
      ))}
    </Stack>
  );
}
