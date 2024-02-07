import { useAppSelector } from "logic";
import { Card, Col, Row, Stack } from "react-bootstrap";
import { CharacterProps } from "../Props";
import { useMemo } from "react";
import { CasterId, Spell, isCasterId } from "model";

function filterOnLevelAndClass(classId: CasterId, level: number) {
  return (spell: Spell) => {
    const def = spell.levels[classId];
    if (def === undefined) {
      // Not for this spell caster class
      return false;
    } else if (typeof def === "number") {
      // One level defined
      return def === level;
    } else {
      // Range of levels
      return def.min <= level && level <= def.max;
    }
  };
}

export function SpellsSelection({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  const classId = character.getClass()?.id;

  const availableSpells = useMemo(
    () => (isCasterId(classId) ? data.spells.filter((s) => s.levels[classId] !== undefined) : []),
    [data, classId]
  );

  if (classId === undefined || !isCasterId(classId)) {
    return null;
  }

  const levels = [0, 1, 2, 3, 4, 5, 6];

  return levels.map((level) => (
    <Row key={level}>
      <Col xs="3">
        <Stack direction="vertical" gap={2}>
          <h2>Sélection</h2>
        </Stack>
      </Col>
      <Col>
        <Stack direction="vertical" gap={2}>
          <h2>Sorts de niveau {level}</h2>
          <Row>
            {availableSpells.filter(filterOnLevelAndClass(classId, level)).map((spell) => (
              <Col key={spell.id} lg={4} className="mb-3">
                <Card key={spell.id}>
                  <Card.Header>{spell.name}</Card.Header>
                  <Card.Body>
                    <span className="text-muted">{spell.description}</span>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Stack>
      </Col>
    </Row>
  ));
}
