"use client";

import { useParams } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Stack from "react-bootstrap/Stack";
import { mutators, useAppDispatch } from "logic";
import { FormSelectRace } from "app/components/FormSelectRace";
import { useStaticData } from "logic/StaticContext";
import { IdSchema, Race } from "model";
import { Card } from "ui";
import { useCharacterPresenter } from "../helpers-client";
import { updateRace, UpdateRaceInput, UpdateState } from "./actions";
import FormSelectVariant from "./FormSelectVariant";
import FormSelectVariantBonus from "./FormSelectVariantBonus";
import { ActionErrors } from "app/helpers-server";

export function RaceSelection({
  races,
  state,
  setState,
}: Readonly<{ races: Race[]; state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>): JSX.Element {
  const dispatch = useAppDispatch();
  const avatars = useStaticData().avatars;
  const { character } = useParams();
  const presenter = useCharacterPresenter();
  const [errors, setErrors] = useState<ActionErrors<UpdateRaceInput>>({});

  const characterId = IdSchema.parse(character);
  const selectedRace = races.find((r) => r.id === state.race);
  const selectedVariant = presenter.getRaceVariant();

  async function handleRaceChange(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const raceId = e.target.value;
    const result = await updateRace({ characterId, raceId });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateRaceVariant(id));
  }

  function handleSelectableBonusChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateSelectableBonus(id));
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
            <FormSelectVariantBonus
              value={presenter.getRaceSelectableBonus() ?? ""}
              onChange={handleSelectableBonusChange}
            />
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
