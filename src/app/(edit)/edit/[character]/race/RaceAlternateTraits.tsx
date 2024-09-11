"use client";

import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { mutators, useAppDispatch } from "logic";
import { type RaceFeature } from "view";
import FeatureComponent from "../FeatureComponent";
import { useCharacterPresenter } from "../helpers-client";
import { Alert } from "react-bootstrap";

export function RaceAlternateTraits() {
  const dispatch = useAppDispatch();
  const presenter = useCharacterPresenter();
  const traits = presenter.getSecondaryRaceTraits();

  function handleTraitEnabled(trait: RaceFeature, e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.checked) {
      dispatch(mutators.enableSecondaryTrait(trait));
    } else {
      dispatch(mutators.disableSecondaryTrait(trait));
    }
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Traits alternatifs</h2>
      {traits.map((trait) => {
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
      {traits.length === 0 && (
        <Alert variant="info" className="d-flex align-items-center">
          <i className="bi bi-info-circle flex-shrink-0 me-3 display-5"></i>
          <div>
            <i>Sélectionnez une race pour afficher ses potentiels traits alternatifs.</i>
          </div>
        </Alert>
      )}
    </Stack>
  );
}
