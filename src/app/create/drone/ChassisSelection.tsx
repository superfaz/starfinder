"use client";

import { DronePresenter, mutators, retrieveClassDetails, useAppDispatch, useClassDetails } from "logic";
import { ClassMechanic } from "model";
import { useEffect, useMemo } from "react";
import { Form, Stack } from "react-bootstrap";
import { useCharacterPresenter } from "../helpers-client";
import { CardAbilityScores } from "../sheet/CardAbilityScores";

function useDronePresenter(classDetails: ClassMechanic | undefined) {
  const parent = useCharacterPresenter();
  return useMemo(() => {
    if (classDetails === undefined) {
      return undefined;
    } else {
      return new DronePresenter(parent, classDetails);
    }
  }, [parent, classDetails]);
}

export function ChassisSelection() {
  const classDetails = useClassDetails<ClassMechanic>("mechanic");
  const presenter = useDronePresenter(classDetails);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails("mechanic"));
    }
  }, [dispatch, classDetails]);

  if (!classDetails || !presenter) {
    return (
      <Stack direction="vertical" gap={2}>
        <h2>Chassis</h2>
        <p>Loading...</p>
      </Stack>
    );
  }

  const chassis = classDetails.drone.chassis;
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
      {selectedChassis && (
        <Stack direction="vertical" gap={2}>
          <div className="text-muted">{selectedChassis.description}</div>
          <CardAbilityScores presenter={presenter} />
        </Stack>
      )}
    </Stack>
  );
}
