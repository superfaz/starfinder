import { ChangeEvent } from "react";
import { Badge, Form, Stack } from "react-bootstrap";
import { findOrError } from "app/helpers";
import { TabEditProps } from "../TabEditProps";

export default function ThemeNoneEditor({ data, character, mutators }: TabEditProps) {
  function handleNoThemeAbilityChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    mutators.updateNoThemeAbilityScore(id);
  }

  return (
    <>
      <Form.FloatingLabel controlId="noThemeAbility" label="Choix de la caractérisque">
        <Form.Select value={character.getNoThemeAbilityScore() || ""} onChange={handleNoThemeAbilityChange}>
          {data.abilityScores.map((abilityScore) => (
            <option key={abilityScore.id} value={abilityScore.id}>
              {abilityScore.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      <Stack direction="horizontal">
        <Badge bg={"primary"}>
          {findOrError(data.abilityScores, (a) => a.id === character.getNoThemeAbilityScore()).code}
          {" +1"}
        </Badge>
      </Stack>
    </>
  );
}
