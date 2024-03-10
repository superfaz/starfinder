"use client";

import { Stack } from "react-bootstrap";
import FeatureComponent from "../FeatureComponent";
import { useCharacterPresenter } from "../helpers";

export function RaceTraits() {
  const presenter = useCharacterPresenter();
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Traits raciaux</h2>
      {presenter.getPrimaryRaceTraits().map((trait) => {
        const isTraitEnabled = presenter.getSelectedRaceTraits().find((t) => t.id === trait.id) !== undefined;
        return (
          <FeatureComponent
            key={trait.id}
            character={presenter}
            feature={trait}
            className={isTraitEnabled ? "border-primary" : "text-decoration-line-through"}
          />
        );
      })}
    </Stack>
  );
}
