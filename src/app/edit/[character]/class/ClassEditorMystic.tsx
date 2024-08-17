import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import { mutators, useAppDispatch } from "logic";
import type { ClassMystic } from "model";
import { useClassDetails } from "../helpers-client";
import { CharacterProps } from "../Props";

export default function MysticEditor({ presenter }: CharacterProps) {
  const classDetails = useClassDetails<ClassMystic>("mystic");
  const dispatch = useAppDispatch();

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const selectedConnection = classDetails.connections.find((s) => s.id === presenter.getMysticConnection());

  const handleConnectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(mutators.updateMysticConnection(event.target.value));
  };

  return (
    <>
      <Form.FloatingLabel controlId="mysticConnection" label="Connection mystique">
        <Form.Select value={presenter.getMysticConnection() ?? ""} onChange={handleConnectionChange}>
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
