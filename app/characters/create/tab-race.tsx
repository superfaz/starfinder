import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Badge, Card, Form, Stack } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { Character, ClientComponentData } from "./types";
import ModifierComponent from "./ModifierComponent";
import { Modifier, SecondaryTrait, Trait } from "app/types";

export function TabRaceSelection({
  data,
  character,
  setCharacter,
}: {
  data: ClientComponentData;
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
}) {
  const selectedRace = data.races.find((r) => r.id === character.race) || null;
  const selectedVariant = selectedRace?.variants.find((v) => v.id === character.raceVariant) || null;

  function handleRaceChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    let race = data.races.find((r) => r.id === id);
    if (race === undefined) {
      setCharacter({
        ...character,
        race: "",
        raceVariant: "",
        raceOptions: undefined,
        traits: [],
      });
    } else if (id === "humans") {
      setCharacter({
        ...character,
        race: id,
        raceVariant: race.variants[0].id,
        raceOptions: { humanBonus: data.abilityScores[0].id },
        traits: race.traits.map((t) => t.id),
      });
    } else {
      setCharacter({
        ...character,
        race: id,
        raceVariant: race.variants[0].id,
        raceOptions: undefined,
        traits: race.traits.map((t) => t.id),
      });
    }
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    if (id === "humans-standard") {
      setCharacter({ ...character, raceVariant: id, raceOptions: { humanBonus: data.abilityScores[0].id } });
    } else {
      setCharacter({ ...character, raceVariant: id, raceOptions: undefined });
    }
  }

  function handleHumanBonusChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    setCharacter({ ...character, raceOptions: { humanBonus: id } });
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Race</h2>
      <Form.FloatingLabel controlId="race" label="Race">
        <Form.Select value={character.race} onChange={handleRaceChange}>
          {character.race === "" && <option value=""></option>}
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
                <Form.Select value={character.raceVariant} onChange={handleVariantChange}>
                  {selectedRace.variants.map((variant, index) => (
                    <option key={index} value={variant.id}>
                      {variant.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.FloatingLabel>
              {selectedVariant.id !== "humans-standard" && (
                <Stack direction="horizontal">
                  {Object.entries(selectedVariant.abilityScores).map(([key, value]) => (
                    <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                      {findOrError(data.abilityScores, (a) => a.id === key).code} {value > 0 ? "+" : ""}
                      {value}
                    </Badge>
                  ))}
                </Stack>
              )}
              {selectedVariant.id === "humans-standard" && character.raceOptions && (
                <>
                  <Form.FloatingLabel controlId="humanBonus" label="Choix de la charactérisque">
                    <Form.Select value={character.raceOptions.humanBonus} onChange={handleHumanBonusChange}>
                      {data.abilityScores.map((abilityScore) => (
                        <option key={abilityScore.id} value={abilityScore.id}>
                          {abilityScore.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.FloatingLabel>
                  <Stack direction="horizontal">
                    <Badge bg="primary">
                      {
                        findOrError(
                          data.abilityScores,
                          (a) => character.raceOptions !== undefined && a.id === character.raceOptions.humanBonus
                        ).code
                      }
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

export function TabRaceTraits({ data, character }: { data: ClientComponentData; character: Character }) {
  const selectedRace = data.races.find((r) => r.id === character.race) || null;
  if (!selectedRace) {
    return null;
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Traits raciaux</h2>
      {selectedRace.traits.map((trait) => (
        <Card
          key={trait.id}
          className={character.traits.find((t) => t === trait.id) !== undefined ? "" : "text-decoration-line-through"}
        >
          <Card.Header>{trait.name}</Card.Header>
          <Card.Body>
            {trait.description && <p className="text-muted">{trait.description}</p>}
            {trait.modifiers &&
              trait.modifiers.map((modifier) => <ModifierComponent key={modifier.id} modifier={modifier} />)}
          </Card.Body>
        </Card>
      ))}
    </Stack>
  );
}

export function TabRaceAlternateTraits({
  data,
  character,
  setCharacter,
}: {
  data: ClientComponentData;
  character: Character;
  setCharacter: (c: Character) => void;
}) {
  const selectedRace = data.races.find((r) => r.id === character.race) || null;

  function findReplacedTrait(id: string): Trait | Modifier | null {
    if (!selectedRace) {
      return null;
    }

    let trait = selectedRace.traits.find((t) => t.id === id);
    if (trait) {
      return trait;
    }

    let modifier = selectedRace.traits
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
      let updatedTraits = character.traits.filter((t) => trait.replace.findIndex((r) => r === t) === -1);
      setCharacter({ ...character, traits: [...updatedTraits, trait.id] });
    } else {
      setCharacter({ ...character, traits: character.traits.filter((t) => t !== trait.id).concat(trait.replace) });
    }
  }

  if (!selectedRace) {
    return null;
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Traits alternatifs</h2>
      {selectedRace.secondaryTraits &&
        selectedRace.secondaryTraits.map((trait) => (
          <Card key={trait.id}>
            <Card.Header>
              <Form.Switch
                label={trait.name}
                checked={character.traits.find((t) => t === trait.id) !== undefined}
                onChange={(e) => handleTraitEnabled(trait, e)}
                disabled={
                  character.traits.find((t) => t === trait.id) === undefined &&
                  trait.replace.some((r) => character.traits.find((t) => t === r) === undefined)
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
        ))}
    </Stack>
  );
}
