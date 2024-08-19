import { groupBy } from "app/helpers";
import { Race } from "model";
import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

const labels = {
  core: "Standard",
  legacy: "Héritage",
};

export function RaceSelection({
  races,
  value,
  onChange,
  isInvalid,
}: {
  races: Race[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isInvalid?: boolean;
}) {
  const selectedRace = races.find((r) => r.id === value);
  const groupedRaces = groupBy(races, (r) => r.category);

  return (
    <>
      <Form.FloatingLabel controlId="race" label="Race">
        <Form.Select name="race" value={value} onChange={onChange} isInvalid={isInvalid}>
          {value === "" && <option value=""></option>}
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
        <div className="invalid-feedback">Cette race n&rsquo;est pas valide</div>
      </Form.FloatingLabel>
      {selectedRace && <div className="text-muted">{selectedRace?.description}</div>}
    </>
  );
}
