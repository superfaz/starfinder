"use client";

import { ChangeEvent } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { displayBonus } from "app/helpers";
import { SkillPresenter, mutators, useAppDispatch } from "logic";
import { useCharacterPresenter } from "../helpers";

type SkillProps = Readonly<{
  skill: SkillPresenter;
  availableSkillRanks: number;
  onCheck: (event: ChangeEvent<HTMLInputElement>) => void;
}>;

function Skill({ skill, availableSkillRanks, onCheck }: SkillProps) {
  return (
    <Form.Group key={skill.id} as={Row} controlId={skill.id} data-testid={skill.id}>
      <Form.Label column>
        <span className="me-1">{skill.fullName}</span>
        {skill.definition.trainedOnly && (
          <i className="bi bi-mortarboard-fill text-secondary me-1" title="Formation nécessaire"></i>
        )}
        {skill.definition.armorCheckPenalty && (
          <i className="bi bi-shield-shaded text-secondary me-1" title="Le malus d’armure aux tests s’applique"></i>
        )}
      </Form.Label>
      <Col lg={2} className="pt-2 text-center">
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
      <Col lg={2} className="pt-2 text-center">
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
      <Col lg={2} className="pt-2 text-center">
        {skill.bonus !== undefined && (
          <Badge bg={skill.bonus > 0 ? "primary" : "secondary"}>{displayBonus(skill.bonus)}</Badge>
        )}
        {skill.bonus === undefined && "-"}
      </Col>
    </Form.Group>
  );
}

export function Skills() {
  const presenter = useCharacterPresenter();
  const dispatch = useAppDispatch();

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
            title="Rangs de compétence à distribuer"
            type="text"
            className={"text-center " + (availableSkillRanks < 0 && "bg-danger")}
            value={availableSkillRanks}
            disabled
          />
        </Col>
        <Col lg={2}></Col>
      </Row>

      {presenter.getSkills().map((skill) => (
        <Skill key={skill.id} skill={skill} availableSkillRanks={availableSkillRanks} onCheck={handleSkillRankChange} />
      ))}
    </Stack>
  );
}
