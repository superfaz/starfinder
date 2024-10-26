import { useParams } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { findOrError } from "app/helpers";
import { ActionErrors } from "app/helpers-server";
import { useStaticData } from "logic/StaticContext";
import { AbilityScoreIdSchema, IdSchema } from "model";
import { Badge } from "ui";
import { UpdateState, updateThemelessAbilityScore, UpdateThemelessInput } from "./actions";

export default function ThemelessEditor({
  state,
  setState,
}: Readonly<{
  state: UpdateState;
  setState: Dispatch<SetStateAction<UpdateState>>;
}>) {
  const abilityScores = useStaticData().abilityScores;
  const { character } = useParams();
  const [errors, setErrors] = useState<ActionErrors<UpdateThemelessInput>>({});

  const abilityScoreId = state.themelessAbilityScore;
  const characterId = IdSchema.parse(character);

  async function handleThemelessAbilityScoreChange(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const abilityScoreId = AbilityScoreIdSchema.parse(e.target.value);
    const result = await updateThemelessAbilityScore({ characterId, abilityScoreId });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <>
      <Form.FloatingLabel controlId="themelessAbility" label="Caractérisque du thème" className="mt-3">
        <Form.Select
          value={abilityScoreId ?? ""}
          onChange={handleThemelessAbilityScoreChange}
          isInvalid={!!errors.abilityScoreId}
        >
          {abilityScoreId === undefined && <option value=""></option>}
          {abilityScores.map((abilityScore) => (
            <option key={abilityScore.id} value={abilityScore.id}>
              {abilityScore.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {abilityScoreId && (
        <Stack direction="horizontal" className="right">
          <Badge bg={"primary"}>
            {findOrError(abilityScores, abilityScoreId).code}
            {" +1"}
          </Badge>
        </Stack>
      )}
    </>
  );
}
