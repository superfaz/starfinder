import { ChangeEvent } from "react";
import { Badge, Col, Form, Row, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { SimpleEditProps } from "../Props";
import { useAppSelector } from "../store";

export function Skills({ character, mutators }: SimpleEditProps) {
  const data = useAppSelector((state) => state.data);

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
            <span className="me-1">{skill.definition.name}</span>
            {skill.definition.abilityScore && (
              <span className="me-1">
                ({findOrError(data.abilityScores, (a) => a.id === skill.definition.abilityScore).code})
              </span>
            )}
            {skill.definition.trainedOnly && (
              <i className="bi bi-mortarboard-fill text-secondary me-1" title="Formation nécessaire"></i>
            )}
            {skill.definition.armorCheckPenalty && (
              <i className="bi bi-shield-shaded text-secondary me-1" title="Le malus d’armure aux tests s’applique"></i>
            )}
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
