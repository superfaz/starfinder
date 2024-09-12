import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Badge } from "ui";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { CharacterProps } from "../Props";

export default function RaceSelectableBonusEditor({ presenter }: CharacterProps): JSX.Element {
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  function handleSelectableBonusChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateSelectableBonus(id));
  }

  return (
    <>
      <Form.FloatingLabel controlId="selectableBonus" label="Choix de la charactérisque">
        <Form.Select value={presenter.getRaceSelectableBonus() ?? ""} onChange={handleSelectableBonusChange}>
          {data.abilityScores.map((abilityScore) => (
            <option key={abilityScore.id} value={abilityScore.id}>
              {abilityScore.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      <Stack direction="horizontal" className="right">
        <Badge bg="primary">
          {findOrError(data.abilityScores, presenter.getRaceSelectableBonus()).code}
          {" +2"}
        </Badge>
      </Stack>
    </>
  );
}
