"use client";

import { Card, Stack } from "react-bootstrap";
import { useCharacterPresenter } from "../helpers";
import { isFeat } from "view";
import ModifierComponent from "../ModifierComponent";

const categories: Record<string, string> = {
  ex: "EXT",
  ma: "MAG",
  su: "SUR",
};

export function SkillsModifiers() {
  const presenter = useCharacterPresenter();
  const types = ["skill", "classSkill", "rankSkill"];
  const features = [
    ...presenter.getSelectedRaceTraits().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...presenter.getThemeFeatures().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...presenter.getClassFeatures().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...presenter.getFeats().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
  ];
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Modificateurs</h2>
      {features.map((feature) => (
        <Card key={isFeat(feature) ? feature.id + "-" + feature.target : feature.id}>
          <Card.Header>
            {feature.name}
            {!isFeat(feature) && feature.category && ` (${categories[feature.category]})`}
          </Card.Header>
          <Card.Body>
            {feature.modifiers
              .filter((m) => types.includes(m.type))
              .map((modifier) => (
                <ModifierComponent key={modifier.id} modifier={modifier} />
              ))}
          </Card.Body>
        </Card>
      ))}
    </Stack>
  );
}
