"use client";

import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { mutators, useAppDispatch } from "logic";
import { RaceFeature } from "view";
import FeatureComponent from "../FeatureComponent";
import { useCharacterPresenter } from "../helpers";

export function RaceAlternateTraits() {
  const dispatch = useAppDispatch();
  const presenter = useCharacterPresenter();

  function handleTraitEnabled(trait: RaceFeature, e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.checked) {
      dispatch(mutators.enableSecondaryTrait(trait));
    } else {
      dispatch(mutators.disableSecondaryTrait(trait));
    }
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Traits alternatifs</h2>
      {presenter.getSecondaryRaceTraits().map((trait) => {
        const isTraitEnabled = presenter.getSelectedRaceTraits().find((t) => t.id === trait.id) !== undefined;
        return (
          <FeatureComponent
            key={trait.id}
            character={presenter}
            feature={trait}
            className={isTraitEnabled ? "border-primary" : ""}
          >
            <Form.Switch
              role="switch"
              aria-label={trait.name}
              label={trait.name}
              checked={isTraitEnabled}
              onChange={(e) => handleTraitEnabled(trait, e)}
              disabled={
                !isTraitEnabled &&
                trait.replace.some((r) => presenter.getSelectedRaceTraits().find((t) => t.id === r) === undefined)
              }
            />
          </FeatureComponent>
        );
      })}
    </Stack>
  );
}
