import { useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Typeahead from "ui/Typeahead";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { AbilityScoreId, AbilityScoreIds, Profession, simpleHash } from "model";
import { CharacterProps } from "../Props";

export default function ThemeIconEditor({ presenter }: CharacterProps) {
  const profession = presenter.getIconProfession();
  const dispatch = useAppDispatch();
  const abilityScores = useAppSelector((state) => state.data.abilityScores);
  const [abilityScore, setAbilityScore] = useState<AbilityScoreId>(profession?.abilityScore ?? AbilityScoreIds.cha);
  const optionsForAbilityScores = useMemo(() => {
    return [AbilityScoreIds.cha, AbilityScoreIds.int, AbilityScoreIds.wis]
      .map((key) => findOrError(abilityScores, key))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [abilityScores]);

  const professionName = profession?.name ?? "";
  const professions = presenter.getAllProfessions();

  function handleProfessionChange(name: string): void {
    if (name === professionName) {
      return;
    }

    if (profession) {
      dispatch(mutators.removeProfessionSkill(profession.id));
    }

    if (name === "") {
      dispatch(mutators.updateIconProfession(undefined));
    } else {
      const newProfession: Profession = professions.find((p) => p.name === name) ?? {
        id: "prof-" + simpleHash(name),
        abilityScore: abilityScore,
        name,
      };

      dispatch(mutators.addProfessionSkill(newProfession));
      dispatch(mutators.updateIconProfession(newProfession.id));
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
