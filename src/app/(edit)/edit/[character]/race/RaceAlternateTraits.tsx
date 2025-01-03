"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { type OriginFeature } from "view";
import FeatureComponent from "../FeatureComponent";
import { updateSecondaryTrait, UpdateState } from "./actions";
import { useParams } from "next/navigation";
import { IdSchema } from "model";

export function RaceAlternateTraits({
  state,
  setState,
}: Readonly<{ state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>) {
  const { character } = useParams();
  const characterId = IdSchema.parse(character);

  const traits = state.secondaryTraits;

  async function handleTraitEnabled(trait: OriginFeature, e: ChangeEvent<HTMLInputElement>) {
    const result = await updateSecondaryTrait({ characterId, traitId: trait.id, enable: e.target.checked });
    if (result.success) {
      setState(result);
    } else {
      console.error(result.errors);
      throw new Error("Failed to update secondary trait");
    }
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Traits alternatifs</h2>
      {traits.map((trait) => {
        const isTraitEnabled = state.selectedTraits.includes(trait.id);
        return (
          <FeatureComponent key={trait.id} feature={trait} className={isTraitEnabled ? "border-primary" : ""}>
            <Form.Switch
              role="switch"
              aria-label={trait.name}
              label={trait.name}
              checked={isTraitEnabled}
              onChange={(e) => handleTraitEnabled(trait, e)}
              disabled={!isTraitEnabled && trait.replace.some((r) => !state.selectedTraits.includes(r.id))}
            />
          </FeatureComponent>
        );
      })}
      {traits.length === 0 && (
        <Alert variant="info" className="d-flex align-items-center">
          <i className="bi bi-info-circle-fill flex-shrink-0 me-3"></i>
          <div>
            <i>Sélectionnez une race pour afficher ses potentiels traits alternatifs.</i>
          </div>
        </Alert>
      )}
    </Stack>
  );
}
