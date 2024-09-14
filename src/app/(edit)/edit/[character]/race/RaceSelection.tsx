"use client";

import { ChangeEvent } from "react";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { mutators, useAppDispatch } from "logic";
import { FormSelectRace } from "app/components/FormSelectRace";
import { useStaticData } from "logic/StaticContext";
import { RaceEntry } from "view";
import { useCharacterPresenter } from "../helpers-client";
import FormSelectVariant from "./FormSelectVariant";
import FormSelectVariantBonus from "./FormSelectVariantBonus";

export function RaceSelection({ races }: Readonly<{ races: RaceEntry[] }>): JSX.Element {
  const dispatch = useAppDispatch();
  const avatars = useStaticData().avatars;
  const presenter = useCharacterPresenter();
  const selectedRace = presenter.getRace();
  const selectedVariant = presenter.getRaceVariant();

  function handleRaceChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateRace(id));
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
      <FormSelectRace races={races} value={selectedRace?.id || ""} onChange={handleRaceChange} />

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
