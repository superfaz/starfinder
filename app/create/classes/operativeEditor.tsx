import { ChangeEvent, useEffect } from "react";
import { Form } from "react-bootstrap";
import { SimpleEditProps } from "../Props";
import { retrieveClassDetails, useAppDispatch, useAppSelector } from "../store";

export default function OperativeEditor({ character, mutators }: SimpleEditProps) {
  const operativeData = useAppSelector((state) => state.classesDetails.operative);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!operativeData) {
      dispatch(retrieveClassDetails("operative"));
    }
  }, [dispatch, operativeData]);

  if (!operativeData) {
    return <p>Loading...</p>;
  }

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
          {operativeData.specializations.map((specialization) => (
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
