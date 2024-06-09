import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { findOrError } from "app/helpers";
import { CharacterPresenter, mutators, useAppDispatch, useAppSelector } from "logic";

interface IThemelessEditorProps {
  character: CharacterPresenter;
}

export default function ThemelessEditor({ character }: Readonly<IThemelessEditorProps>) {
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  function handleThemelessAbilityChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateThemelessAbilityScore(id));
  }

  return (
    <>
      <Form.FloatingLabel controlId="themelessAbility" label="Caractérisque du thème" className="mt-3">
        <Form.Select value={character.getThemelessAbilityScore() ?? ""} onChange={handleThemelessAbilityChange}>
          {data.abilityScores.map((abilityScore) => (
            <option key={abilityScore.id} value={abilityScore.id}>
              {abilityScore.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      <Stack direction="horizontal" className="right">
        <Badge bg={"primary"}>
          {findOrError(data.abilityScores, character.getThemelessAbilityScore()).code}
          {" +1"}
        </Badge>
      </Stack>
    </>
  );
}
