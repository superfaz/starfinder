"use client";

import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/Stack";
import FeatureComponent from "../FeatureComponent";
import { UpdateState } from "./actions";

export function RaceTraits({ state }: Readonly<{ state: UpdateState }>) {
  const traits = state.primaryTraits;
  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Traits raciaux</h2>
      {traits.map((trait) => {
        const isTraitEnabled = state.selectedTraits.find((t) => t === trait.id) !== undefined;
        return (
          <FeatureComponent
            key={trait.id}
            feature={trait}
            className={isTraitEnabled ? "border-primary" : "text-decoration-line-through"}
          />
        );
      })}
      {traits.length === 0 && (
        <Alert variant="info" className="d-flex align-items-center">
          <i className="bi bi-info-circle flex-shrink-0 me-3 display-5"></i>
          <div>
            <i>Sélectionnez une race pour afficher ses principaux traits raciaux.</i>
          </div>
        </Alert>
      )}
    </Stack>
  );
}
