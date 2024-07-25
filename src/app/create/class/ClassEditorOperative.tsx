import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import { mutators, useAppDispatch } from "logic";
import type { ClassOperative } from "model";
import { useClassDetails } from "../helpers-client";
import { CharacterProps } from "../Props";

export default function OperativeEditor({ presenter }: CharacterProps) {
  const classDetails = useClassDetails<ClassOperative>("operative");
  const dispatch = useAppDispatch();

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const selectedSpecialization = classDetails.specializations.find(
    (s) => s.id === presenter.getOperativeSpecialization()
  );

  const handleSpecializationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(mutators.updateOperativeSpecialization(event.target.value));
  };

  return (
    <>
      <Form.FloatingLabel controlId="operativeSpecialization" label="Spécialisation">
        <Form.Select value={presenter.getOperativeSpecialization() ?? ""} onChange={handleSpecializationChange}>
          {classDetails.specializations.map((specialization) => (
            <option key={specialization.id} value={specialization.id}>
              {specialization.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedSpecialization && <p className="text-muted">{selectedSpecialization.description}</p>}
    </>
  );
}
