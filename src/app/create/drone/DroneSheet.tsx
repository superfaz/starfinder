"use client";

import { Stack } from "react-bootstrap";
import { CardAbilityScores } from "../sheet/CardAbilityScores";
import { useDronePresenter } from "../helpers-client";

export function DroneSheet() {
  const presenter = useDronePresenter();

  if (!presenter) {
    return (
      <Stack direction="vertical" gap={2}>
        <h2>Détails du Drone</h2>
        <p>Loading...</p>
      </Stack>
    );
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Détails du Drone</h2>
      <CardAbilityScores presenter={presenter} />
    </Stack>
  );
}
