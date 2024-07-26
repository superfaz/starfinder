"use client";

import { Stack } from "react-bootstrap";
import { CardAbilityScores } from "../sheet/CardAbilityScores";
import { useDronePresenter } from "../helpers-client";
import { CardDroneProfile } from "./CardDroneProfile";
import { CardSavingThrows } from "../sheet/CardSavingThrows";
import { CardArmorClass } from "../sheet/CardArmorClass";
import { CardSkills } from "../sheet/CardSkills";
import { CardAttackBonuses } from "../sheet/CardAttackBonuses";

export function DroneSheetOne() {
  const presenter = useDronePresenter();

  if (!presenter) {
    return null;
  }

  return (
    <Stack direction="vertical" gap={2}>
      <CardDroneProfile presenter={presenter} />
      <CardSavingThrows presenter={presenter} />
      <CardArmorClass presenter={presenter} />
      <CardAttackBonuses presenter={presenter} />
    </Stack>
  );
}

export function DroneSheetTwo() {
  const presenter = useDronePresenter();

  if (!presenter) {
    return null;
  }

  return (
    <Stack direction="vertical" gap={2}>
      <CardAbilityScores presenter={presenter} />
      <CardSkills presenter={presenter} />
    </Stack>
  );
}

export function DroneSheetThree() {
  const presenter = useDronePresenter();

  if (!presenter) {
    return null;
  }

  return (
    <Stack direction="vertical" gap={2}>
      <CardAbilityScores presenter={presenter} />
    </Stack>
  );
}
