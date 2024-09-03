import { groupBy } from "app/helpers";
import type { Book } from "model";
import type { ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { ReferenceComponent } from "./ReferenceComponent";
import { RaceEntry } from "view";

export function RaceSelection({
  books,
  races,
  value,
  onChange,
  isInvalid,
}: Readonly<{
  books: Book[];
  races: RaceEntry[];
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
      {selectedRace && <div className="text-muted">{selectedRace?.description}</div>}
      {selectedRace && <ReferenceComponent books={books} reference={selectedRace.reference} />}
    </>
  );
}
