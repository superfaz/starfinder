import dynamic from "next/dynamic";
import { ChangeEvent } from "react";
import { Badge, Form, Stack } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { CharacterMutators, CharacterPresenter } from "logic";
import { CharacterTabProps } from "./CharacterTabProps";

const LazyEnvoyClassEditor = dynamic(() => import("./classes/envoyEditor"));
const LazyEnvoyClassDetails = dynamic(() => import("./classes/envoyDetails"));
const LazyOperativeClassEditor = dynamic(() => import("./classes/operativeEditor"));
const LazyOperativeClassDetails = dynamic(() => import("./classes/operativeDetails"));

function ClassEditor({ character, mutators }: { character: CharacterPresenter; mutators: CharacterMutators }) {
  const selectedClass = character.getClass();

  if (!selectedClass) {
    return null;
  }

  switch (selectedClass.id) {
    case "class-operative":
      return <LazyOperativeClassEditor character={character} mutators={mutators} />;

    case "class-envoy":
      return <LazyEnvoyClassEditor />;

    default:
      return null;
  }
}

function ClassDetails({ character }: { character: CharacterPresenter }): JSX.Element | null {
  const selectedClass = character.getClass();

  if (!selectedClass) {
    return null;
  }

  switch (selectedClass.id) {
    case "class-operative":
      return <LazyOperativeClassDetails character={character} />;

    case "class-envoy":
      return <LazyEnvoyClassDetails character={character} />;

    default:
      return null;
  }
}

export function TabClassSelection({ data, character, mutators }: CharacterTabProps) {
  const selectedClass = character.getClass();

  function handleClassChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    mutators.updateClass(id);
  }

  function handleSoldierAbilityScoreChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    mutators.updateSoldierAbilityScore(id);
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Classe</h2>
      <Form.FloatingLabel controlId="class" label="Classe">
        <Form.Select value={selectedClass?.id || ""} onChange={handleClassChange}>
          {selectedClass === null && <option value=""></option>}
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
            {!character.isSoldier() && (
              <Badge bg="primary">
                {findOrError(data.abilityScores, (a) => a.id === selectedClass.primaryAbilityScore).code}
              </Badge>
            )}
            <Badge bg="primary">EN +{selectedClass.staminaPoints}</Badge>
            <Badge bg="primary">PV +{selectedClass.hitPoints}</Badge>
          </Stack>
          <p className="text-muted">{selectedClass.description}</p>
        </>
      )}
      {character.isSoldier() && (
        <>
          <Form.FloatingLabel controlId="soldierAbilityScore" label="Caractérisque de classe">
            <Form.Select value={character.getSoldierAbilityScore() || ""} onChange={handleSoldierAbilityScoreChange}>
              <option value="str">{findOrError(data.abilityScores, (a) => a.id === "str").name}</option>
              <option value="dex">{findOrError(data.abilityScores, (a) => a.id === "dex").name}</option>
            </Form.Select>
          </Form.FloatingLabel>
          <Stack direction="horizontal">
            <Badge bg="primary">
              {findOrError(data.abilityScores, (a) => a.id === character.getSoldierAbilityScore()).code}
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
          <ClassEditor character={character} mutators={mutators} />
        </>
      )}
    </Stack>
  );
}

export function TabClassDetails({ character }: { character: CharacterPresenter }) {
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Abilités de classe</h2>
      <ClassDetails character={character} />
    </Stack>
  );
}
