import dynamic from "next/dynamic";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Badge, Form, Stack } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { Class } from "model";
import { Character, ClientComponentData, Context } from "./types";

const LazyOperativeClassEditor = dynamic(() => import("./classes/operativeEditor"));
const LazyOperativeClassDetails = dynamic(() => import("./classes/operativeDetails"));

function ClassEditor({
  classType,
  character,
  setCharacter,
}: {
  classType: Class;
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
}) {
  switch (classType.id) {
    case "class-operative":
      return <LazyOperativeClassEditor character={character} setCharacter={setCharacter} />;

    default:
      return null;
  }
}

export function TabClassSelection({
  data,
  character,
  setCharacter,
}: {
  data: ClientComponentData;
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
}) {
  const selectedClass = data.classes.find((c) => c.id === character.class);

  function handleClassChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    if (id === "7d165a8f-d874-4d09-88ff-9f2ccd77a3ab") {
      // Soldier
      setCharacter({ ...character, class: id, classOptions: { soldierAbilityScore: "str" } });
    } else {
      setCharacter({ ...character, class: id, classOptions: undefined });
    }
  }

  function handleSoldierAbilityScoreChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    setCharacter({ ...character, classOptions: { soldierAbilityScore: id } });
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Classe</h2>
      <Form.FloatingLabel controlId="class" label="Classe">
        <Form.Select value={character.class} onChange={handleClassChange}>
          {character.class === "" && <option value=""></option>}
          {data.classes.map((classType) => (
            <option key={classType.id} value={classType.id}>
              {classType.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedClass && (
        <>
          <Stack direction="horizontal">
            {!Array.isArray(selectedClass.keyAbilityScore) && (
              <Badge bg="primary">
                {findOrError(data.abilityScores, (a) => a.id === selectedClass.keyAbilityScore).code}
              </Badge>
            )}
            <Badge bg="primary">EN +{selectedClass.staminaPoints}</Badge>
            <Badge bg="primary">PV +{selectedClass.hitPoints}</Badge>
          </Stack>
          <p className="text-muted">{selectedClass.description}</p>
        </>
      )}
      {selectedClass && selectedClass.id === "7d165a8f-d874-4d09-88ff-9f2ccd77a3ab" && character.classOptions && (
        <>
          <Form.FloatingLabel controlId="soldierAbilityScore" label="Caractérisque de classe">
            <Form.Select value={character.classOptions.soldierAbilityScore} onChange={handleSoldierAbilityScoreChange}>
              <option value="str">{findOrError(data.abilityScores, (a) => a.id === "str").name}</option>
              <option value="dex">{findOrError(data.abilityScores, (a) => a.id === "dex").name}</option>
            </Form.Select>
          </Form.FloatingLabel>
          <Stack direction="horizontal">
            <Badge bg="primary">
              {
                findOrError(
                  data.abilityScores,
                  (a) => character.classOptions !== undefined && a.id === character.classOptions.soldierAbilityScore
                ).code
              }
            </Badge>
          </Stack>
        </>
      )}
      {selectedClass && (
        <>
          <hr />
          <div>
            <Badge bg="primary">Rang de compétence</Badge>+{selectedClass.skillRank}
          </div>
          <div>
            <Badge bg="primary">Armures</Badge>
            {selectedClass.armors.map((a) => data.armors[a]).join(", ")}
          </div>
          <div>
            <Badge bg="primary">Armes</Badge>
            {selectedClass.weapons.map((a) => data.weapons[a]).join(", ")}
          </div>
          <hr />
          <ClassEditor classType={selectedClass} character={character} setCharacter={setCharacter} />
        </>
      )}
    </Stack>
  );
}

export function TabClassDetails({
  data,
  character,
  context,
}: {
  data: ClientComponentData;
  character: Character;
  context: Context;
}) {
  const selectedClass = data.classes.find((c) => c.id === character.class);

  if (selectedClass === undefined) {
    return null;
  }

  switch (selectedClass.id) {
    case "class-operative":
      return <LazyOperativeClassDetails character={character} context={context} />;

    default:
      return null;
  }
}
