"use client";

import { useParams } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Stack from "react-bootstrap/Stack";
import { FormSelectRace } from "app/components/FormSelectRace";
import { ActionErrors } from "app/helpers-server";
import { useStaticData } from "logic/StaticContext";
import { IdSchema, Origin } from "model";
import { Card } from "ui";
import { updateRace, UpdateRaceInput, updateSelectableBonus, UpdateState, updateVariant } from "./actions";
import FormSelectVariant from "./FormSelectVariant";
import FormSelectVariantBonus from "./FormSelectVariantBonus";

export function RaceSelection({
  races,
  state,
  setState,
}: Readonly<{ races: Origin[]; state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>): JSX.Element {
  const avatars = useStaticData().avatars;
  const { character } = useParams();
  const [errors, setErrors] = useState<ActionErrors<UpdateRaceInput>>({});

  const characterId = IdSchema.parse(character);
  const selectedRace = races.find((r) => r.id === state.race);
  const selectedVariant = selectedRace?.variants.find((v) => v.id === state.variant);
  const raceSelectableBonus = state.selectableBonus;

  async function handleRaceChange(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const raceId = e.target.value;
    const result = await updateRace({ characterId, raceId });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  async function handleVariantChange(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const variantId = e.target.value;
    const result = await updateVariant({ characterId, variantId });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  async function handleSelectableBonusChange(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const abilityScoreId = e.target.value;
    const result = await updateSelectableBonus({ characterId, abilityScoreId });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Race</h2>
      <FormSelectRace
        races={races}
        value={selectedRace?.id ?? ""}
        onChange={handleRaceChange}
        isInvalid={!!errors.raceId}
      />

      {selectedRace && (
        <FormSelectVariant
          variants={selectedRace.variants}
          value={selectedVariant?.id || ""}
          onChange={handleVariantChange}
        >
          {selectedVariant && Object.keys(selectedVariant.abilityScores).length === 0 && (
            <FormSelectVariantBonus value={raceSelectableBonus ?? ""} onChange={handleSelectableBonusChange} />
          )}
        </FormSelectVariant>
      )}

      {selectedRace && (
        <>
          <hr className="d-none d-sm-block" />
          <Card className="d-none d-sm-block">
            <picture>
              <img
                alt=""
                src={"/" + avatars.find((a) => a.tags.includes(selectedRace.id))?.image}
                className="img-fluid"
              />
            </picture>
          </Card>
        </>
      )}
    </Stack>
  );
}
