import { Dispatch, SetStateAction, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import { findOrError } from "app/helpers";
import { ActionErrors } from "app/helpers-server";
import { useStaticData } from "logic/StaticContext";
import { AbilityScoreId, AbilityScoreIds, IdSchema } from "model";
import Typeahead from "ui/Typeahead";
import { updateIconProfession, UpdateIconProfessionInput, UpdateState } from "./actions";
import { useParams } from "next/navigation";

export default function ThemeIconEditor({
  state,
  setState,
}: Readonly<{
  state: UpdateState;
  setState: Dispatch<SetStateAction<UpdateState>>;
}>) {
  const profession = state.iconProfession;
  const abilityScores = useStaticData().abilityScores;
  const { character } = useParams();
  const [, setErrors] = useState<ActionErrors<UpdateIconProfessionInput>>({});
  const [abilityScore, setAbilityScore] = useState<AbilityScoreId>(profession?.abilityScore ?? AbilityScoreIds.cha);
  const optionsForAbilityScores = useMemo(() => {
    return [AbilityScoreIds.cha, AbilityScoreIds.int, AbilityScoreIds.wis]
      .map((key) => findOrError(abilityScores, key))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [abilityScores]);

  const characterId = IdSchema.parse(character);
  const professionName = profession?.name ?? "";
  const professions = state.iconAllProfessions;

  async function handleProfessionChange(name: string): Promise<void> {
    const result = await updateIconProfession({ characterId: characterId, abilityScoreId: abilityScore, name });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <>
      <div className="mt-3">Profession iconique</div>
      <Form.FloatingLabel controlId="profAbilityScore" label="Caractérisque de référence">
        <Form.Select value={abilityScore} onChange={(e) => setAbilityScore(e.target.value as AbilityScoreId)}>
          {optionsForAbilityScores.map((abilityScore) => (
            <option key={abilityScore.id} value={abilityScore.id}>
              {abilityScore.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      <Typeahead
        controlId="profName"
        label="Nom de la profession iconique"
        value={professionName}
        onChange={handleProfessionChange}
        options={professions.filter((p) => p.abilityScore === abilityScore)}
      />
    </>
  );
}
