import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { ChangeEvent } from "react";
import { Badge, Form, Stack } from "react-bootstrap";
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
      <Stack direction="horizontal">
        <Badge bg="primary">
          {findOrError(data.abilityScores, (a) => a.id === character.getHumanStandardBonus()).code}
          {" +2"}
        </Badge>
      </Stack>
    </>
  );
}
