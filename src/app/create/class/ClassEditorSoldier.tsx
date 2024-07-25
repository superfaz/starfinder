import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import { mutators, useAppDispatch } from "logic";
import type { ClassSoldier } from "model";
import { useClassDetails } from "../helpers-client";
import { CharacterProps } from "../Props";

export default function SoldierEditor({ presenter }: CharacterProps) {
  const classDetails = useClassDetails<ClassSoldier>("soldier");
  const dispatch = useAppDispatch();

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
