import { ChangeEvent, useEffect } from "react";
import { Form } from "react-bootstrap";
import { SimpleEditProps } from "../Props";
import { retrieveClassDetails, useAppDispatch, useClassDetails } from "logic";
import { ClassOperative } from "model";

export default function OperativeEditor({ character, mutators }: SimpleEditProps) {
  const classDetails = useClassDetails<ClassOperative>("operative");
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails("operative"));
    }
  }, [dispatch, classDetails]);

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const selectedSpecialization = classDetails.specializations.find(
    (s) => s.id === character.getOperativeSpecialization()
  );

  const handleSpecializationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    mutators.updateOperativeSpecialization(event.target.value);
  };

  return (
    <>
      <Form.FloatingLabel label="Spécialisation">
        <Form.Select value={character.getOperativeSpecialization() ?? ""} onChange={handleSpecializationChange}>
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
