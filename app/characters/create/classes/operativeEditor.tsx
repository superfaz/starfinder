import { Form } from "react-bootstrap";
import { ChangeEvent } from "react";
import operativeData from "data/class-operative.json";
import CharacterPresenter from "logic/CharacterPresenter";
import CharacterMutators from "logic/CharacterMutators";

export default function OperativeEditor({
  character,
  mutators,
}: {
  character: CharacterPresenter;
  mutators: CharacterMutators;
}) {
  const selectedSpecialization = operativeData.specializations.find(
    (s) => s.id === character.getOperativeSpecialization()
  );

  const handleSpecializationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    mutators.updateOperativeSpecialization(event.target.value);
  };

  return (
    <>
      <Form.FloatingLabel label="Spécialisation">
        <Form.Select value={character.getOperativeSpecialization() || ""} onChange={handleSpecializationChange}>
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
