"use client";

import { Stack } from "react-bootstrap";
import { CardAbilityScores } from "../sheet/CardAbilityScores";
import { useDronePresenter } from "../helpers-client";
import { CardDroneProfile } from "./CardDroneProfile";
import { CardSavingThrows } from "../sheet/CardSavingThrows";
import { CardArmorClass } from "../sheet/CardArmorClass";

export function DroneSheet() {
  const presenter = useDronePresenter();

  if (!presenter) {
    return (
      <Stack direction="vertical" gap={2}>
        <h2>Détails du drone</h2>
        <p>Loading...</p>
      </Stack>
    );
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Détails du drone</h2>
      <CardDroneProfile presenter={presenter} />
      <CardAbilityScores presenter={presenter} />
      <CardSavingThrows presenter={presenter} />
      <CardArmorClass presenter={presenter} />
    </Stack>
  );
}
