import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Badge } from "ui";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { CharacterProps } from "../Props";

export default function ThemelessEditor({ presenter }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  function handleThemelessAbilityChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateThemelessAbilityScore(id));
  }

  return (
    <>
      <Form.FloatingLabel controlId="themelessAbility" label="Caractérisque du thème" className="mt-3">
        <Form.Select value={presenter.getThemelessAbilityScore() ?? ""} onChange={handleThemelessAbilityChange}>
          {data.abilityScores.map((abilityScore) => (
            <option key={abilityScore.id} value={abilityScore.id}>
              {abilityScore.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      <Stack direction="horizontal" className="right">
        <Badge bg={"primary"}>
          {findOrError(data.abilityScores, presenter.getThemelessAbilityScore()).code}
          {" +1"}
        </Badge>
      </Stack>
    </>
  );
}
