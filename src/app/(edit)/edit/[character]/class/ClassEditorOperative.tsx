import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Form from "react-bootstrap/Form";
import { ActionErrors } from "app/helpers-server";
import type { ClassOperative } from "model";
import { useCharacterId } from "../helpers-client";
import { updateOperativeSpecialization, UpdateOperativeSpecializationInput, UpdateState } from "./actions";

export default function OperativeEditor({
  state,
  setState,
}: Readonly<{ state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>) {
  const characterId = useCharacterId();
  const classDetails = state.details as ClassOperative | undefined;
  const [errors, setErrors] = useState<ActionErrors<UpdateOperativeSpecializationInput>>({});
  if (!classDetails) {
    return null;
  }

  const selectedSpecialization = classDetails.specializations.find((s) => s.id === state.operativeSpecialization);

  async function handleSpecializationChange(event: ChangeEvent<HTMLSelectElement>) {
    const result = await updateOperativeSpecialization({ characterId, specializationId: event.target.value });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <>
      <Form.FloatingLabel controlId="operativeSpecialization" label="Spécialisation">
        <Form.Select
          value={state.operativeSpecialization ?? ""}
          onChange={handleSpecializationChange}
          isInvalid={!!errors.specializationId}
        >
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
