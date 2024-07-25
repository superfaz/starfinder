import { ChangeEvent, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { mutators, retrieveClassDetails, useAppDispatch } from "logic";
import type { ClassMechanic } from "model";
import { useClassDetails } from "../helpers-client";
import { CharacterProps } from "../Props";

export default function MysticEditor({ presenter }: CharacterProps) {
  const classDetails = useClassDetails<ClassMechanic>("mechanic");
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails("mechanic"));
    }
  }, [dispatch, classDetails]);

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const selectedStyle = classDetails.styles.find((s) => s.id === presenter.getMechanicStyle());

  const handleStyleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(mutators.updateMechanicStyle(event.target.value));
  };

  return (
    <>
      <Form.FloatingLabel controlId="mechanicStyle" label="Style de Mécano">
        <Form.Select value={presenter.getMechanicStyle() ?? ""} onChange={handleStyleChange}>
          {classDetails.styles.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedStyle && <p className="text-muted">{selectedStyle.description}</p>}
    </>
  );
}
