import { ChangeEvent } from "react";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { CharacterProps } from "../Props";

export default function ThemeNoneEditor({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  function handleNoThemeAbilityChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateNoThemeAbilityScore(id));
  }

  return (
    <>
      <Form.FloatingLabel controlId="noThemeAbility" label="Caractérisque du thème">
        <Form.Select value={character.getNoThemeAbilityScore() ?? ""} onChange={handleNoThemeAbilityChange}>
          {data.abilityScores.map((abilityScore) => (
            <option key={abilityScore.id} value={abilityScore.id}>
              {abilityScore.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      <Stack direction="horizontal" className="right">
        <Badge bg={"primary"}>
          {findOrError(data.abilityScores, character.getNoThemeAbilityScore()).code}
          {" +1"}
        </Badge>
      </Stack>
    </>
  );
}
