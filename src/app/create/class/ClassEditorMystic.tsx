import { ChangeEvent, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { CharacterProps } from "../Props";
import { mutators, retrieveClassDetails, useAppDispatch, useClassDetails } from "logic";
import type { ClassMystic } from "model";

export default function MysticEditor({ character }: CharacterProps) {
  const classDetails = useClassDetails<ClassMystic>("mystic");
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!classDetails) {
      dispatch(retrieveClassDetails("mystic"));
    }
  }, [dispatch, classDetails]);

  if (!classDetails) {
    return <p>Loading...</p>;
  }

  const selectedConnection = classDetails.connections.find((s) => s.id === character.getMysticConnection());

  const handleConnectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(mutators.updateMysticConnection(event.target.value));
  };

  return (
    <>
      <Form.FloatingLabel label="Connection mystique">
        <Form.Select value={character.getMysticConnection() ?? ""} onChange={handleConnectionChange}>
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
