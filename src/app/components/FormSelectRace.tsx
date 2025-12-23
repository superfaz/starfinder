import type { ChangeEvent } from "react";
import { Form, Stack } from "react-bootstrap";
import { findOrError, groupBy } from "app/helpers";
import { useStaticData } from "logic/StaticContext";
import { ModifierTypes, type RaceModifier } from "model";
import { Badge } from "ui";
import { OriginEntry } from "view";
import { ReferenceComponent } from "./ReferenceComponent";

function RaceModifiers({ modifiers }: Readonly<{ modifiers: RaceModifier[] }>) {
  const sizes = useStaticData().sizes;

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

export function FormSelectRace({
  races,
  value,
  onChange,
  isInvalid,
}: Readonly<{
  races: OriginEntry[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isInvalid?: boolean;
}>) {
  const selectedRace = races.find((r) => r.id === value);
  const groupedRaces = groupBy(races, (r) => r.category);

  return (
    <>
      <Form.FloatingLabel controlId="race" label="Race">
        <Form.Select name="race" value={value} onChange={onChange} isInvalid={isInvalid} aria-invalid={isInvalid}>
          {value === "" && <option value=""></option>}
          {Object.entries(groupedRaces).map(([category, races]) => (
            <optgroup key={category} label={category}>
              {races.map((race) => (
                <option key={race.id} value={race.id}>
                  {race.name}
                </option>
              ))}
            </optgroup>
          ))}
        </Form.Select>
        <div className="invalid-feedback">Cette race n&rsquo;est pas valide</div>
      </Form.FloatingLabel>
      {selectedRace && <RaceModifiers modifiers={selectedRace.modifiers} />}
      {selectedRace && <div className="text-muted">{selectedRace?.description}</div>}
      {selectedRace && <ReferenceComponent reference={selectedRace.reference} />}
    </>
  );
}
