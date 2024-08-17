"use client";

import Stack from "react-bootstrap/Stack";
import { ModifierTypes, hasTarget } from "model";
import { useCharacterPresenter } from "../helpers-client";
import { FeatureDisplay } from "./FeatureDisplay";

const types: string[] = [
  ModifierTypes.classSkill,
  ModifierTypes.rankSkill,
  ModifierTypes.skill,
  ModifierTypes.skillTrained,
];

export function SkillsModifiers() {
  const presenter = useCharacterPresenter();

  if (presenter.getClass() === null) {
    return null;
  }

  const features = [
    ...presenter.getSelectedRaceTraits().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...presenter.getThemeFeatures().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...presenter.getClassFeatures().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...presenter.getFeats().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
  ];
  return (
    <Stack direction="vertical" gap={2} data-testid="modifiers">
      <h2>Modificateurs</h2>
      {features.map((feature) => (
        <FeatureDisplay
          key={hasTarget(feature) ? feature.id + "-" + feature.target : feature.id}
          presenter={presenter}
          feature={feature}
        />
      ))}
    </Stack>
  );
}
