import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Form from "react-bootstrap/Form";
import { ActionErrors } from "app/helpers-server";
import type { ClassMechanic } from "model";
import { useCharacterId } from "../helpers-client";
import { updateMechanicStyle, UpdateMechanicStyleInput, UpdateState } from "./actions";

export default function MysticEditor({
  state,
  setState,
}: Readonly<{ state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>) {
  const characterId = useCharacterId();
  const classDetails = state.details as ClassMechanic | undefined;
  const [errors, setErrors] = useState<ActionErrors<UpdateMechanicStyleInput>>({});

  if (!classDetails) {
    return null;
  }

  const selectedStyle = classDetails.styles.find((s) => s.id === state.mechanicStyle);

  async function handleStyleChange(event: ChangeEvent<HTMLSelectElement>) {
    const result = await updateMechanicStyle({ characterId, styleId: event.target.value });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <>
      <Form.FloatingLabel controlId="mechanicStyle" label="Style de Mécano">
        <Form.Select value={state.mechanicStyle ?? ""} onChange={handleStyleChange} isInvalid={!!errors.styleId}>
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
