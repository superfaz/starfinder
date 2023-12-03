import { Form } from "react-bootstrap";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Character } from "../types";
import operativeData from "@/data/class-operative.json";

export default function OperativeEditor({
  character,
  setCharacter,
}: {
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
}) {
  useEffect(() => {
    if (character.classOptions === undefined || character.classOptions === null) {
      setCharacter({
        ...character,
        classOptions: { ...character.classOptions, operativeSpecialization: operativeData.specializations[0].id },
      });
    }
  });

  const selectedSpecialization = operativeData.specializations.find(
    (s) => s.id === character.classOptions?.operativeSpecialization
  );

  const handleSpecializationChange = (event) => {
    setCharacter({
      ...character,
      classOptions: { ...character.classOptions, operativeSpecialization: event.target.value },
    });
  };

  return (
    <>
      <Form.FloatingLabel label="Spécialisation">
        <Form.Select value={character.classOptions?.operativeSpecialization} onChange={handleSpecializationChange}>
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
