"use client";

import { mutators, useAppDispatch } from "logic";
import { Form, Stack } from "react-bootstrap";
import { useDronePresenter } from "../helpers-client";

export function ChassisSelection() {
  const presenter = useDronePresenter();
  const dispatch = useAppDispatch();

  if (!presenter) {
    return (
      <Stack direction="vertical" gap={2}>
        <h2>Chassis</h2>
        <p>Loading...</p>
      </Stack>
    );
  }

  const chassis = presenter.getAllChassis();
  const selectedChassis = presenter.getChassis();

  function handleChassisChange(event: React.ChangeEvent<HTMLSelectElement>) {
    console.log(event.target.value);
    dispatch(mutators.updateDroneChassis(event.target.value));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Chassis</h2>
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
    </Stack>
  );
}
