import { ChangeEvent } from "react";
import { Badge, Card, Form, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { DataSet } from "data";
import { CharacterMutators, CharacterPresenter } from "logic";
import { Feature, ModifierTemplate, SecondaryTrait } from "model";
import ModifierComponent from "./ModifierComponent";

export interface CharacterTabProps {
  data: DataSet;
  character: CharacterPresenter;
  mutators: CharacterMutators;
}

export function TabRaceSelection({ data, character, mutators }: CharacterTabProps) {
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

export function TabRaceTraits({ character }: { character: CharacterPresenter }) {
  const selectedRace = character.getRace();
  if (!selectedRace) {
    return null;
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Traits raciaux</h2>
      {selectedRace.traits.map((trait) => {
        const isTraitEnabled = character.getRaceTraits().find((t) => t.id === trait.id) !== undefined;
        return (
          <Card key={trait.id} className={isTraitEnabled ? "border-primary" : "text-decoration-line-through"}>
            <Card.Header>{trait.name}</Card.Header>
            <Card.Body>
              {trait.description && <p className="text-muted">{trait.description}</p>}
              {trait.modifiers &&
                trait.modifiers.map((modifier) => <ModifierComponent key={modifier.id} modifier={modifier} />)}
            </Card.Body>
          </Card>
        );
      })}
    </Stack>
  );
}

export function TabRaceAlternateTraits({
  character,
  mutators,
}: {
  character: CharacterPresenter;
  mutators: CharacterMutators;
}) {
  const selectedRace = character.getRace();

  function findReplacedTrait(id: string): Feature | ModifierTemplate | null {
    if (!selectedRace) {
      return null;
    }

    const trait = selectedRace.traits.find((t) => t.id === id);
    if (trait) {
      return trait;
    }

    const modifier = selectedRace.traits
      .map((t) => t.modifiers)
      .flat()
      .find((c) => c !== undefined && c.id === id);
    if (modifier) {
      return modifier;
    }

    return null;
  }

  function handleTraitEnabled(trait: SecondaryTrait, e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.checked) {
      mutators.enableSecondaryTrait(trait);
    } else {
      mutators.disableSecondaryTrait(trait);
    }
  }

  if (!selectedRace) {
    return null;
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Traits alternatifs</h2>
      {selectedRace.secondaryTraits &&
        selectedRace.secondaryTraits.map((trait) => {
          const isTraitEnabled = character.getRaceTraits().find((t) => t.id === trait.id) !== undefined;
          return (
            <Card key={trait.id} className={isTraitEnabled ? "border-primary" : ""}>
              <Card.Header>
                <Form.Switch
                  label={trait.name}
                  checked={isTraitEnabled}
                  onChange={(e) => handleTraitEnabled(trait, e)}
                  disabled={
                    !isTraitEnabled &&
                    trait.replace.some((r) => character.getRaceTraits().find((t) => t.id === r) === undefined)
                  }
                />
              </Card.Header>
              <Card.Body>
                <div key={trait.id}>
                  <div>
                    <span>Remplace : </span>
                    {trait.replace.map((r) => findReplacedTrait(r)?.name).join(", ")}
                  </div>
                  <p className="text-muted">{trait.description}</p>
                  {trait.modifiers &&
                    trait.modifiers.map((modifier) => <ModifierComponent key={modifier.id} modifier={modifier} />)}
                </div>
              </Card.Body>
            </Card>
          );
        })}
    </Stack>
  );
}
