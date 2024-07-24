"use client";

import dynamic from "next/dynamic";
import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { AbilityScoreIds } from "model";
import { useCharacterPresenter } from "../helpers-client";
import { ReferenceComponent } from "../ReferenceComponent";

const LazyEditorEnvoy = dynamic(() => import("./ClassEditorEnvoy"));
const LazyEditorMechanic = dynamic(() => import("./ClassEditorMechanic"));
const LazyEditorMystic = dynamic(() => import("./ClassEditorMystic"));
const LazyEditorOperative = dynamic(() => import("./ClassEditorOperative"));
const LazyEditorSolarian = dynamic(() => import("./ClassEditorSolarian"));
const LazyEditorSoldier = dynamic(() => import("./ClassEditorSoldier"));

export function LazyClassEditor(): JSX.Element | null {
  const presenter = useCharacterPresenter();
  const selectedClass = presenter.getClass();

  if (!selectedClass) {
    return null;
  }

  switch (selectedClass.id) {
    case "envoy":
      return <LazyEditorEnvoy presenter={presenter} />;

    case "mechanic":
      return <LazyEditorMechanic presenter={presenter} />;

    case "mystic":
      return <LazyEditorMystic presenter={presenter} />;

    case "operative":
      return <LazyEditorOperative presenter={presenter} />;

    case "solarian":
      return <LazyEditorSolarian presenter={presenter} />;

    case "soldier":
      return <LazyEditorSoldier presenter={presenter} />;

    default:
      return null;
  }
}

export function ClassSelection() {
  const data = useAppSelector((state) => state.data);
  const presenter = useCharacterPresenter();
  const dispatch = useAppDispatch();

  if (presenter.getTheme() === null) {
    return null;
  }

  const selectedClass = presenter.getClass();

  function handleClassChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateClass(id));
  }

  function handleSoldierAbilityScoreChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateSoldierAbilityScore(id));
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
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
          <Stack direction="horizontal" className="right">
            {!presenter.isSoldier() && (
              <Badge bg="primary">{findOrError(data.abilityScores, selectedClass.primaryAbilityScore).code}</Badge>
            )}
            <Badge bg="primary">EN +{selectedClass.staminaPoints}</Badge>
            <Badge bg="primary">PV +{selectedClass.hitPoints}</Badge>
          </Stack>
          <div className="text-muted">{selectedClass.description}</div>
          <ReferenceComponent reference={selectedClass.reference} />
        </>
      )}
      {presenter.isSoldier() && (
        <>
          <Form.FloatingLabel controlId="soldierAbilityScore" label="Caractérisque de classe" className="mt-3">
            <Form.Select value={presenter.getSoldierAbilityScore() ?? ""} onChange={handleSoldierAbilityScoreChange}>
              {[AbilityScoreIds.str, AbilityScoreIds.dex].map((id) => (
                <option key={id} value={id}>
                  {findOrError(data.abilityScores, id).name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          <Stack direction="horizontal" className="right">
            <Badge bg="primary">{findOrError(data.abilityScores, presenter.getSoldierAbilityScore()).code}</Badge>
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
            {selectedClass.armors.map((a) => findOrError(data.armorTypes, a).name).join(", ")}
          </div>
          <div>
            <Badge bg="primary">Armes</Badge>
            {selectedClass.weapons.map((a) => findOrError(data.weaponTypes, a).name).join(", ")}
          </div>
          <hr />
          <LazyClassEditor />
        </>
      )}
    </Stack>
  );
}
