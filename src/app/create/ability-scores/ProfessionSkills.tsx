import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Typeahead } from "react-bootstrap-typeahead";
import { findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { AbilityScoreId, AbilityScoreIds, Profession, isProfession, simpleHash } from "model";

type NewOption = { id: string; name: string; customOption: true };

export function ProfessionSkills({ onClose }: { onClose: () => void }) {
  const professions = useAppSelector((state) => state.data.professions);
  const abilityScores = useAppSelector((state) => state.data.abilityScores);
  const dispatch = useAppDispatch();
  const [abilityScore, setAbilityScore] = useState<AbilityScoreId>(AbilityScoreIds.cha);
  const [selectedProfession, setSelectedProfession] = useState<Array<Profession | NewOption>>([]);

  const optionsForAbilityScores = useMemo(() => {
    return [AbilityScoreIds.cha, AbilityScoreIds.int, AbilityScoreIds.wis]
      .map((key) => findOrError(abilityScores, key))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [abilityScores]);

  const optionsForProfessions = useMemo(() => {
    return professions.filter((p) => p.abilityScore === abilityScore).sort((a, b) => a.name.localeCompare(b.name));
  }, [abilityScore, professions]);

  function handleAddProfession() {
    const selected = selectedProfession[0];
    if (isProfession(selected)) {
      dispatch(mutators.addProfessionSkill(selected));
    } else {
      const profession: Profession = {
        id: "prof-" + simpleHash(selectedProfession[0].name),
        abilityScore: abilityScore,
        name: selectedProfession[0].name,
      };

      dispatch(mutators.addProfessionSkill(profession));
      setSelectedProfession([]);
    }

    handleClose();
  }

  function handleClose() {
    setAbilityScore(AbilityScoreIds.cha);
    setSelectedProfession([]);
    onClose();
  }

  return (
    <Card>
      <Card.Header>Compétences de profession</Card.Header>
      <Card.Body>
        <Form.FloatingLabel controlId="profAbilityScore" label="Caractérisque de référence">
          <Form.Select value={abilityScore} onChange={(e) => setAbilityScore(e.target.value as AbilityScoreId)}>
            {optionsForAbilityScores.map((abilityScore) => (
              <option key={abilityScore.id} value={abilityScore.id}>
                {abilityScore.name}
              </option>
            ))}
          </Form.Select>
        </Form.FloatingLabel>
        <Form.FloatingLabel controlId="profName" label="Nom de la profession">
          <Typeahead
            id="profName"
            allowNew={true}
            clearButton={true}
            newSelectionPrefix="Ajouter une profession : "
            labelKey="name"
            options={optionsForProfessions}
            selected={selectedProfession}
            onChange={(e) => setSelectedProfession(e as Profession[] | NewOption[])}
          />
        </Form.FloatingLabel>
        <Stack direction="horizontal" gap={2}>
          <Button variant="primary" onClick={handleAddProfession} disabled={selectedProfession.length == 0}>
            Ajouter aux compétences
          </Button>
          <Button variant="link" onClick={handleClose}>
            Annuler
          </Button>
        </Stack>
      </Card.Body>
    </Card>
  );
}
