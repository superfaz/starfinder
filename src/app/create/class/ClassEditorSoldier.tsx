import { ChangeEvent, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { CharacterProps } from "../Props";
import { mutators, retrieveClassDetails, useAppDispatch, useClassDetails } from "logic";
import type { ClassSoldier } from "model";

export default function SoldierEditor({ presenter }: CharacterProps) {
  const classDetails = useClassDetails<ClassSoldier>("soldier");
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails("soldier"));
    }
  }, [dispatch, classDetails]);

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const selectedStyle = classDetails.styles.find((s) => s.id === presenter.getSoldierPrimaryStyle());

  const handleStyleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(mutators.updateSoldierPrimaryStyle(event.target.value));
  };

  return (
    <>
      <Form.FloatingLabel controlId="soldierPrimaryStyle" label="Style de combat">
        <Form.Select value={presenter.getSoldierPrimaryStyle() ?? ""} onChange={handleStyleChange}>
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
