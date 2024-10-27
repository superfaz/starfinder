import dynamic from "next/dynamic";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { findOrError } from "app/helpers";
import { ActionErrors } from "app/helpers-server";
import { useStaticData } from "logic/StaticContext";
import { AbilityScoreIds, IdSchema, INamedModel, ofType } from "model";
import { Badge } from "ui";
import { ReferenceComponent } from "../ReferenceComponent";
import {
  updateClass,
  UpdateClassInput,
  updateSoldierAbilityScore,
  UpdateSoldierAbilityScoreInput,
  UpdateState,
} from "./actions";
import { useParams } from "next/navigation";

const LazyEditorEnvoy = dynamic(() => import("./ClassEditorEnvoy"));
const LazyEditorMechanic = dynamic(() => import("./ClassEditorMechanic"));
const LazyEditorMystic = dynamic(() => import("./ClassEditorMystic"));
const LazyEditorOperative = dynamic(() => import("./ClassEditorOperative"));
const LazyEditorSolarian = dynamic(() => import("./ClassEditorSolarian"));
const LazyEditorSoldier = dynamic(() => import("./ClassEditorSoldier"));

export function LazyClassEditor({
  state,
  setState,
}: Readonly<{ state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>): JSX.Element | null {
  const selectedClass = state.class;

  if (!selectedClass) {
    return null;
  }

  switch (selectedClass.id) {
    case "envoy":
      return <LazyEditorEnvoy state={state} setState={setState} />;

    case "mechanic":
      return <LazyEditorMechanic state={state} setState={setState} />;

    case "mystic":
      return <LazyEditorMystic state={state} setState={setState} />;

    case "operative":
      return <LazyEditorOperative state={state} setState={setState} />;

    case "solarian":
      return <LazyEditorSolarian state={state} setState={setState} />;

    case "soldier":
      return <LazyEditorSoldier state={state} setState={setState} />;

    default:
      return null;
  }
}

export function ClassSelection({
  classes,
  state,
  setState,
}: Readonly<{
  classes: INamedModel[];
  state: UpdateState;
  setState: Dispatch<SetStateAction<UpdateState>>;
}>): JSX.Element | null {
  const data = useStaticData();
  const { character } = useParams();
  const [errors, setErrors] = useState<ActionErrors<UpdateClassInput>>({});
  const [soldierErrors, setSoldierErrors] = useState<ActionErrors<UpdateSoldierAbilityScoreInput>>({});

  const characterId = IdSchema.parse(character);

  async function handleClassChange(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const classId = e.target.value;
    const result = await updateClass({ characterId, classId });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  async function handleSoldierAbilityScoreChange(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const abilityScoreId = e.target.value;
    const result = await updateSoldierAbilityScore({ characterId, abilityScoreId });
    if (result.success) {
      setState(result);
    } else {
      setSoldierErrors(result.errors);
    }
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Classe</h2>
      <Form.FloatingLabel controlId="class" label="Classe">
        <Form.Select value={state.class?.id ?? ""} onChange={handleClassChange} isInvalid={!!errors.classId}>
          {!state.class && <option value=""></option>}
          {classes.map((classType) => (
            <option key={classType.id} value={classType.id}>
              {classType.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {state.class && (
        <>
          <Stack direction="horizontal" className="right">
            {state.class.id !== "soldier" && (
              <Badge bg="primary">{findOrError(data.abilityScores, state.class.primaryAbilityScore).code}</Badge>
            )}
            <Badge bg="primary">EN +{state.class.staminaPoints}</Badge>
            <Badge bg="primary">PV +{state.class.hitPoints}</Badge>
          </Stack>
          <div className="text-muted">{state.class.description}</div>
          <ReferenceComponent reference={state.class.reference} />
        </>
      )}
      {state.class?.id === "soldier" && (
        <>
          <Form.FloatingLabel controlId="soldierAbilityScore" label="Caractérisque de classe" className="mt-3">
            <Form.Select
              value={state.soldierAbilityScore ?? ""}
              onChange={handleSoldierAbilityScoreChange}
              isInvalid={!!soldierErrors.abilityScoreId}
            >
              {[AbilityScoreIds.str, AbilityScoreIds.dex].map((id) => (
                <option key={id} value={id}>
                  {findOrError(data.abilityScores, id).name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          <Stack direction="horizontal" className="right">
            <Badge bg="primary">{findOrError(data.abilityScores, state.soldierAbilityScore).code}</Badge>
          </Stack>
        </>
      )}
      {state.class && (
        <>
          <hr />
          <div>
            <Badge bg="primary">Rang de compétence</Badge>+{state.class.skillRank}
          </div>
          <div>
            <Badge bg="primary">Armures</Badge>
            {state.class.armors.map((a) => findOrError(data.armorTypes, a).name).join(", ")}
          </div>
          <div>
            <Badge bg="primary">Armes</Badge>
            {state.class.modifiers
              .filter(ofType("weaponProficiency"))
              .map((m) => findOrError(data.weaponTypes, m.target).name)
              .join(", ")}
          </div>
          <hr />
          <LazyClassEditor state={state} setState={setState} />
        </>
      )}
    </Stack>
  );
}
