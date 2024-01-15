import { ChangeEvent } from "react";
import { Badge, Card, Col, Form, Row, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { CharacterProps } from "../Props";
import ModifierComponent from "../ModifierComponent";

const categories: Record<string, string> = {
  ex: "EXT",
  ma: "MAG",
  su: "SUR",
};

export function Skills({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

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
            type="text"
            className={"text-center " + (availableSkillRanks < 0 && "bg-danger")}
            value={availableSkillRanks}
            disabled
          />
        </Col>
        <Col lg={2}></Col>
      </Row>

      {character.getSkills().map((skill) => (
        <Form.Group key={skill.id} as={Row} controlId={skill.id} data-testid={skill.id}>
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

export function SkillsModifiers({ character }: CharacterProps) {
  const types = ["skill", "classSkill", "skillRank"];
  const features = [
    ...character.getSelectedRaceTraits().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...character.getThemeFeatures().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...character.getClassFeatures().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
  ];
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Modificateurs</h2>
      {features.map((feature) => (
        <Card key={feature.id}>
          <Card.Header>
            {feature.name} {feature.category && ` (${categories[feature.category]})`}
          </Card.Header>
          <Card.Body>
            {feature.modifiers
              .filter((m) => types.includes(m.type))
              .map((modifier) => (
                <ModifierComponent key={modifier.id} modifier={modifier} />
              ))}
          </Card.Body>
        </Card>
      ))}
    </Stack>
  );
}
