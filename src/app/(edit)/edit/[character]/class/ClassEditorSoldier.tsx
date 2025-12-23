import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Form from "react-bootstrap/Form";
import { ActionErrors } from "app/helpers-server";
import type { ClassSoldier } from "model";
import { useCharacterId } from "../helpers-client";
import { updateSoldierPrimaryStyle, UpdateSoldierPrimaryStyleInput, UpdateState } from "./actions";

export default function SoldierEditor({
  state,
  setState,
}: Readonly<{ state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>) {
  const characterId = useCharacterId();
  const classDetails = state.details as ClassSoldier | undefined;
  const [errors, setErrors] = useState<ActionErrors<UpdateSoldierPrimaryStyleInput>>({});

  if (!classDetails) {
    return null;
  }

  const selectedStyle = classDetails.styles.find((s) => s.id === state.soldierPrimaryStyle);

  async function handleStyleChange(event: ChangeEvent<HTMLSelectElement>) {
    const result = await updateSoldierPrimaryStyle({ characterId, styleId: event.target.value });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <>
      <Form.FloatingLabel controlId="soldierPrimaryStyle" label="Style de combat">
        <Form.Select value={state.soldierPrimaryStyle ?? ""} onChange={handleStyleChange} isInvalid={!!errors.styleId}>
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
