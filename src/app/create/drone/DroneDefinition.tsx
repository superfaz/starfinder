"use client";

import { mutators, useAppDispatch } from "logic";
import { Form, Stack } from "react-bootstrap";
import { useDronePresenter } from "../helpers-client";
import { ChangeEvent } from "react";

export function DroneDefinition() {
  const presenter = useDronePresenter();
  const dispatch = useAppDispatch();

  if (!presenter) {
    return (
      <Stack direction="vertical" gap={2}>
        <h2>Drone</h2>
        <p>Loading...</p>
      </Stack>
    );
  }

  const chassis = presenter.getAllChassis();
  const selectedChassis = presenter.getChassis();
  const skillUnit = presenter.getSkillUnit();
  const skills = presenter.getAllSkillUnit();

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(mutators.updateDroneName(event.target.value));
  }

  function handleChassisChange(event: ChangeEvent<HTMLSelectElement>) {
    dispatch(mutators.updateDroneChassis(event.target.value));
  }

  function handleSkillUnitChange(event: ChangeEvent<HTMLSelectElement>) {
    dispatch(mutators.updateDroneSkillUnit(event.target.value));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Drone</h2>

      <Form.FloatingLabel controlId="name" label="Nom du drone">
        <Form.Control type="text" value={presenter.getName() ?? ""} onChange={handleNameChange} />
      </Form.FloatingLabel>

      <Form.FloatingLabel controlId="chassis" label="Type de chassis">
        <Form.Select value={selectedChassis?.id ?? ""} onChange={handleChassisChange}>
          {selectedChassis === undefined && <option value=""></option>}
          {chassis.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>

      {selectedChassis && <div className="text-muted">{selectedChassis.description}</div>}

      <Form.FloatingLabel controlId="skillUnit" label="Module de compétence">
        <Form.Select value={skillUnit ?? ""} onChange={handleSkillUnitChange}>
          {skillUnit === undefined && <option value=""></option>}
          {skills.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
    </Stack>
  );
}
