import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Form from "react-bootstrap/Form";
import { ActionErrors } from "app/helpers-server";
import type { ClassMystic } from "model";
import { useCharacterId } from "../helpers-client";
import { updateMysticConnection, UpdateMysticConnectionInput, UpdateState } from "./actions";

export default function MysticEditor({
  state,
  setState,
}: Readonly<{ state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>) {
  const characterId = useCharacterId();
  const classDetails = state.details as ClassMystic | undefined;
  const [errors, setErrors] = useState<ActionErrors<UpdateMysticConnectionInput>>({});
  if (!classDetails) {
    return null;
  }

  const selectedConnection = classDetails.connections.find((s) => s.id === state.mysticConnection);

  async function handleConnectionChange(event: ChangeEvent<HTMLSelectElement>) {
    const result = await updateMysticConnection({ characterId, connectionId: event.target.value });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <>
      <Form.FloatingLabel controlId="mysticConnection" label="Connection mystique">
        <Form.Select
          value={state.mysticConnection ?? ""}
          onChange={handleConnectionChange}
          isInvalid={!!errors.connectionId}
        >
          {classDetails.connections.map((connection) => (
            <option key={connection.id} value={connection.id}>
              {connection.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedConnection && <p className="text-muted">{selectedConnection.description}</p>}
    </>
  );
}
