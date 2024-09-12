"use client";

import { ChangeEvent } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { displayBonus, findOrError, groupBy } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { ModifierTypes, RaceModifier } from "model";
import RaceSelectableBonusEditor from "./RaceHumansEditor";
import { useCharacterPresenter } from "../helpers-client";
import { ReferenceComponent } from "../ReferenceComponent";

const labels = {
  core: "Standard",
  legacy: "Héritage",
};

function RaceModifiers({ modifiers }: Readonly<{ modifiers: RaceModifier[] }>) {
  const sizes = useAppSelector((state) => state.data.sizes);
  return (
    <Stack direction="horizontal" className="right">
      {modifiers.map((modifier, index) => {
        if (modifier.type === ModifierTypes.hitPoints) {
          return (
            <Badge key={index} bg="primary">
              PV +{modifier.value}
            </Badge>
          );
        } else if (modifier.type === ModifierTypes.size) {
          return (
            <Badge key={index} bg="secondary">
              {findOrError(sizes, modifier.target).name}
            </Badge>
          );
        }
      })}
    </Stack>
  );
}

export function RaceSelection() {
  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => state.data);
  const presenter = useCharacterPresenter();
  const selectedRace = presenter.getRace();
  const selectedVariant = presenter.getRaceVariant();
  const groupedRaces = groupBy(data.races, (r) => r.category);

  function handleRaceChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateRace(id));
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateRaceVariant(id));
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Race</h2>
      <Form.FloatingLabel controlId="race" label="Race">
        <Form.Select value={selectedRace?.id ?? ""} onChange={handleRaceChange}>
          {selectedRace === null && <option value=""></option>}
          {Object.entries(groupedRaces).map(([category, races]) => (
            <optgroup key={category} label={labels[category as "core" | "legacy"]}>
              {races.map((race) => (
                <option key={race.id} value={race.id}>
                  {race.name}
                </option>
              ))}
            </optgroup>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedRace && (
        <>
          <RaceModifiers modifiers={selectedRace.modifiers} />
          <div className="text-muted">{selectedRace.description}</div>
          <ReferenceComponent reference={selectedRace.reference} />
        </>
      )}

      {selectedRace && selectedVariant && (
        <>
          <Form.FloatingLabel controlId="variant" label="Variante" className="mt-3">
            <Form.Select value={selectedVariant?.id ?? ""} onChange={handleVariantChange}>
              {selectedRace.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          {Object.entries(selectedVariant.abilityScores).length > 0 && (
            <Stack direction="horizontal" className="right">
              {Object.entries(selectedVariant.abilityScores).map(
                ([key, value]) =>
                  value && (
                    <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                      {findOrError(data.abilityScores, key).code} {displayBonus(value)}
                    </Badge>
                  )
              )}
            </Stack>
          )}
          {Object.keys(selectedVariant.abilityScores).length === 0 && (
            <RaceSelectableBonusEditor presenter={presenter} />
          )}
          {selectedVariant.description && <p className="text-muted">{selectedVariant.description}</p>}
          {selectedVariant.reference && <ReferenceComponent reference={selectedVariant.reference} />}
        </>
      )}

      {selectedRace && (
        <>
          <hr className="d-none d-sm-block" />
          <Card className="d-none d-sm-block">
            <picture>
              <img
                alt=""
                src={"/" + data.avatars.find((a) => a.tags.includes(selectedRace.id))?.image}
                className="img-fluid"
              />
            </picture>
          </Card>
        </>
      )}
    </Stack>
  );
}
