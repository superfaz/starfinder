import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import operativeData from "data/class-operative.json";
import { SimpleEditProps } from "../Props";

export default function OperativeEditor({ character, mutators }: SimpleEditProps) {
  const selectedSpecialization = operativeData.specializations.find(
    (s) => s.id === character.getOperativeSpecialization()
  );

  const handleSpecializationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    mutators.updateOperativeSpecialization(event.target.value);
  };

  return (
    <>
      <Form.FloatingLabel label="Spécialisation">
        <Form.Select value={character.getOperativeSpecialization() ?? ""} onChange={handleSpecializationChange}>
          {operativeData.specializations.map((specialization, i) => (
            <option key={i} value={specialization.id}>
              {specialization.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedSpecialization && <p className="text-muted">{selectedSpecialization.description}</p>}
    </>
  );
}
