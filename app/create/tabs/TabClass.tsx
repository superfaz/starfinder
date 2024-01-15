import dynamic from "next/dynamic";
import { ChangeEvent } from "react";
import { Badge, Form, Stack } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { CharacterProps } from "../Props";
import { AbilityScoreIds } from "model";

const LazyGenericClassDetails = dynamic(() => import("../classes/genericDetails"));

const LazyEnvoyClassEditor = dynamic(() => import("../classes/envoyEditor"));
const LazyOperativeClassEditor = dynamic(() => import("../classes/operativeEditor"));
const LazySoldierClassEditor = dynamic(() => import("../classes/soldierEditor"));

function LazyClassEditor({ character }: CharacterProps): JSX.Element | null {
  const selectedClass = character.getClass();

  if (!selectedClass) {
    return null;
  }

  switch (selectedClass.id) {
    case "envoy":
      return <LazyEnvoyClassEditor />;

    case "operative":
      return <LazyOperativeClassEditor character={character} />;

    case "soldier":
      return <LazySoldierClassEditor character={character} />;

    default:
      return null;
  }
}

function LazyClassDetails({ character }: CharacterProps): JSX.Element | null {
  const selectedClass = character.getClass();

  if (!selectedClass) {
    return null;
  }

  switch (selectedClass.id) {
    case "envoy":
    case "operative":
    case "soldier":
      return <LazyGenericClassDetails character={character} classId={selectedClass.id} />;

    default:
      return null;
  }
}

export function ClassSelection({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  const selectedClass = character.getClass();

  function handleClassChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateClass(id));
  }

  function handleSoldierAbilityScoreChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateSoldierAbilityScore(id));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Classe</h2>
      <Form.FloatingLabel controlId="class" label="Classe">
        <Form.Select value={selectedClass?.id ?? ""} onChange={handleClassChange}>
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
            <Form.Select value={character.getSoldierAbilityScore() ?? ""} onChange={handleSoldierAbilityScoreChange}>
              {[AbilityScoreIds.str, AbilityScoreIds.dex].map((id) => (
                <option key={id} value={id}>
                  {findOrError(data.abilityScores, (a) => a.id === id).name}
                </option>
              ))}
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
            {selectedClass.armors.map((a) => findOrError(data.armors, (e) => e.id === a).name).join(", ")}
          </div>
          <div>
            <Badge bg="primary">Armes</Badge>
            {selectedClass.weapons.map((a) => findOrError(data.weapons, (e) => e.id === a).name).join(", ")}
          </div>
          <hr />
          <LazyClassEditor character={character} />
        </>
      )}
    </Stack>
  );
}

export function ClassDetails({ character }: CharacterProps) {
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Abilités de classe</h2>
      <LazyClassDetails character={character} />
    </Stack>
  );
}
