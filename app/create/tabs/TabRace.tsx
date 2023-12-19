import { ChangeEvent } from "react";
import { Badge, Card, Form, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { CharacterMutators, CharacterPresenter } from "logic";
import { Feature } from "model";
import FeatureComponent from "../FeatureComponent";
import { TabEditProps } from "../TabEditProps";

export function RaceSelection({ data, character, mutators }: TabEditProps) {
  const selectedRace = character.getRace();
  const selectedVariant = character.getRaceVariant();

  function handleRaceChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    mutators.updateRace(id);
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    mutators.updateRaceVariant(id);
  }

  function handleHumanBonusChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    mutators.updateHumanBonus(id);
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Race</h2>
      <Form.FloatingLabel controlId="race" label="Race">
        <Form.Select value={selectedRace?.id || ""} onChange={handleRaceChange}>
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
                <Form.Select value={selectedVariant?.id || ""} onChange={handleVariantChange}>
                  {selectedRace.variants.map((variant, index) => (
                    <option key={index} value={variant.id}>
                      {variant.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.FloatingLabel>
              {!character.isHumanStandard() && (
                <Stack direction="horizontal">
                  {Object.entries(selectedVariant.abilityScores).map(
                    ([key, value]) =>
                      value && (
                        <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                          {findOrError(data.abilityScores, (a) => a.id === key).code}
                          {displayBonus(value)}
                        </Badge>
                      )
                  )}
                </Stack>
              )}
              {character.isHumanStandard() && (
                <>
                  <Form.FloatingLabel controlId="humanBonus" label="Choix de la charactérisque">
                    <Form.Select value={character.getHumanStandardBonus() || ""} onChange={handleHumanBonusChange}>
                      {data.abilityScores.map((abilityScore) => (
                        <option key={abilityScore.id} value={abilityScore.id}>
                          {abilityScore.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.FloatingLabel>
                  <Stack direction="horizontal">
                    <Badge bg="primary">
                      {findOrError(data.abilityScores, (a) => a.id === character.getHumanStandardBonus()).code}
                      {" +2"}
                    </Badge>
                  </Stack>
                </>
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

export function RaceTraits({ character }: { character: CharacterPresenter }) {
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

export function RaceAlternateTraits({
  character,
  mutators,
}: {
  character: CharacterPresenter;
  mutators: CharacterMutators;
}) {
  function handleTraitEnabled(trait: Feature, e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.checked) {
      mutators.enableSecondaryTrait(trait);
    } else {
      mutators.disableSecondaryTrait(trait);
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