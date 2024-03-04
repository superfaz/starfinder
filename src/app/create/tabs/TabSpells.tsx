import * as Sentry from "@sentry/nextjs";
import { ChangeEvent, useMemo } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { CharacterPresenter, mutators, useAppDispatch, useAppSelector } from "logic";
import { type CasterId, type Spell, isCasterId } from "model";
import { CharacterProps } from "../Props";

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

type SpellComponentProps = Readonly<{
  character: CharacterPresenter;
  spell: Spell;
  classId: CasterId;
  level: number;
  selected: boolean;
  disabled: boolean;
}>;
function SpellComponent({ character, spell, classId, level, selected, disabled }: SpellComponentProps) {
  const dispatch = useAppDispatch();

  const def = spell.levels[classId];
  if (def === undefined) {
    Sentry.captureMessage(`Spell ${spell.id} can't be displayed - no level information`);
    return null;
  }

  let name = spell.name;
  let description = spell.description;

  if (typeof def !== "number") {
    name = `${name} - niveau ${level}`;
    if (spell.evolutions !== undefined) {
      const templater = character.createTemplater({ ...spell.evolutions[level.toString()] });
      description = templater.convertString(spell.description);
    }
  }

  function handleSelected(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      dispatch(mutators.addSpell({ id: spell.id, level: level.toString() }));
    } else {
      dispatch(mutators.removeSpell({ id: spell.id, level: level.toString() }));
    }
  }

  return (
    <Card key={spell.id} className={selected ? "border-primary" : undefined}>
      <Card.Header>
        <Form.Check
          id={spell.id + "-" + level}
          label={name}
          disabled={!selected && disabled}
          checked={selected}
          onChange={handleSelected}
        />
      </Card.Header>
      <Card.Body>
        <span className="text-muted">{description}</span>
      </Card.Body>
    </Card>
  );
}

function byName(a: Spell, b: Spell) {
  return a.name.localeCompare(b.name, "fr");
}

export function SpellsSelection({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  const classId = character.getClass()?.id;

  const selectedSpells = character.getSelectedSpells();
  const availableSpells = useMemo(
    () => (isCasterId(classId) ? data.spells.filter((s) => s.levels[classId] !== undefined) : []),
    [data, classId]
  );

  if (classId === undefined || !isCasterId(classId)) {
    return null;
  }

  const levels = [0, 1, 2, 3, 4, 5, 6];

  function isSelected(spell: Spell, level: number) {
    return selectedSpells[level]?.find((s) => s.id === spell.id) !== undefined;
  }

  return levels.map((level) => (
    <Row key={level} data-testid={"spells-" + level}>
      <Col xs="3">
        <Stack direction="vertical" gap={2}>
          <Stack direction="horizontal" gap={2}>
            <h2>Sorts connus</h2>
            <div className="text-muted me-auto">max: {character.getSelectableSpellCount(level)}</div>
          </Stack>
          {selectedSpells[level]?.toSorted(byName).map((spell) => (
            <Col key={spell.id} className="mb-1">
              <Card>
                <Card.Header>{spell.name}</Card.Header>
              </Card>
            </Col>
          ))}
        </Stack>
      </Col>
      <Col>
        <Stack direction="vertical" gap={2}>
          <h2>Sorts de niveau {level}</h2>
          <Row>
            {availableSpells
              .filter(filterOnLevelAndClass(classId, level))
              .sort(byName)
              .map((spell) => (
                <Col key={spell.id} lg={4} className="mb-3">
                  <SpellComponent
                    character={character}
                    spell={spell}
                    classId={classId}
                    level={level}
                    selected={isSelected(spell, level)}
                    disabled={(selectedSpells[level]?.length ?? 0) >= character.getSelectableSpellCount(level)}
                  />
                </Col>
              ))}
          </Row>
        </Stack>
      </Col>
    </Row>
  ));
}
