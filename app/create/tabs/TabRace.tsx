import { ChangeEvent } from "react";
import { Badge, Card, Form, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { Feature } from "model";
import FeatureComponent from "../FeatureComponent";
import type { CharacterProps } from "../Props";
import RaceHumansEditor from "../races/RaceHumansEditor";

export function RaceSelection({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  const selectedRace = character.getRace();
  const selectedVariant = character.getRaceVariant();

  function handleRaceChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateRace(id));
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateRaceVariant(id));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Race</h2>
      <Form.FloatingLabel controlId="race" label="Race">
        <Form.Select value={selectedRace?.id ?? ""} onChange={handleRaceChange}>
          {selectedRace === null && <option value=""></option>}
          {data.races.map((race) => (
            <option key={race.id} value={race.id}>
              {race.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedRace && (
        <>
          <Stack direction="horizontal">
            <Badge bg="primary">PV +{selectedRace.hitPoints}</Badge>
          </Stack>
          <p className="text-muted">{selectedRace.description}</p>
          {selectedRace.variants && selectedVariant && (
            <>
              <Form.FloatingLabel controlId="variant" label="Variante">
                <Form.Select value={selectedVariant?.id ?? ""} onChange={handleVariantChange}>
                  {selectedRace.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.FloatingLabel>
              {Object.entries(selectedVariant.abilityScores).length > 0 && (
                <Stack direction="horizontal">
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
              {character.isHumanStandard() && (
                <RaceHumansEditor character={character} />
              )}
              {selectedVariant.description && <p className="text-muted">{selectedVariant.description}</p>}
            </>
          )}
        </>
      )}

      {selectedRace && (
        <>
          <hr />
          <Card>
            <picture>
              <img alt="" src={"/" + selectedRace.id + "-male.png"} className="img-fluid" />
            </picture>
          </Card>
        </>
      )}
    </Stack>
  );
}

export function RaceTraits({ character }: CharacterProps) {
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Traits raciaux</h2>
      {character.getPrimaryRaceTraits().map((trait) => {
        const isTraitEnabled = character.getSelectedRaceTraits().find((t) => t.id === trait.id) !== undefined;
        return (
          <FeatureComponent
            key={trait.id}
            character={character}
            feature={trait}
            className={isTraitEnabled ? "border-primary" : "text-decoration-line-through"}
          />
        );
      })}
    </Stack>
  );
}

export function RaceAlternateTraits({ character }: CharacterProps) {
  const dispatch = useAppDispatch();

  function handleTraitEnabled(trait: Feature, e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.checked) {
      dispatch(mutators.enableSecondaryTrait(trait));
    } else {
      dispatch(mutators.disableSecondaryTrait(trait));
    }
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Traits alternatifs</h2>
      {character.getSecondaryRaceTraits().map((trait) => {
        const isTraitEnabled = character.getSelectedRaceTraits().find((t) => t.id === trait.id) !== undefined;
        return (
          <FeatureComponent
            key={trait.id}
            character={character}
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
                trait.replace.some((r) => character.getSelectedRaceTraits().find((t) => t.id === r) === undefined)
              }
            />
          </FeatureComponent>
        );
      })}
    </Stack>
  );
}
