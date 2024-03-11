import { ChangeEvent } from "react";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { CharacterProps } from "../Props";

export default function RaceHumansEditor({ character }: CharacterProps): JSX.Element {
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  function handleHumanBonusChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateHumanBonus(id));
  }

  return (
    <>
      <Form.FloatingLabel controlId="humanBonus" label="Choix de la charactérisque">
        <Form.Select value={character.getHumanStandardBonus() ?? ""} onChange={handleHumanBonusChange}>
          {data.abilityScores.map((abilityScore) => (
            <option key={abilityScore.id} value={abilityScore.id}>
              {abilityScore.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      <Stack direction="horizontal" className="right">
        <Badge bg="primary">
          {findOrError(data.abilityScores, character.getHumanStandardBonus()).code}
          {" +2"}
        </Badge>
      </Stack>
    </>
  );
}
