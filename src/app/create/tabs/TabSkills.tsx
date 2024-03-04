import { ChangeEvent, useMemo, useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Typeahead } from "react-bootstrap-typeahead";
import { displayBonus, findOrError } from "app/helpers";
import { SkillPresenter, mutators, useAppDispatch, useAppSelector } from "logic";
import { AbilityScoreId, AbilityScoreIds, Profession, isProfession, simpleHash } from "model";
import { CharacterProps } from "../Props";
import ModifierComponent from "../ModifierComponent";
import { isFeat } from "view";

const categories: Record<string, string> = {
  ex: "EXT",
  ma: "MAG",
  su: "SUR",
};

type SkillProps = Readonly<{
  skill: SkillPresenter;
  availableSkillRanks: number;
  onCheck: (event: ChangeEvent<HTMLInputElement>) => void;
}>;

function Skill({ skill, availableSkillRanks, onCheck }: SkillProps) {
  return (
    <Form.Group key={skill.id} as={Row} controlId={skill.id} data-testid={skill.id}>
      <Form.Label column>
        <span className="me-1">{skill.fullName}</span>
        {skill.definition.trainedOnly && (
          <i className="bi bi-mortarboard-fill text-secondary me-1" title="Formation nécessaire"></i>
        )}
        {skill.definition.armorCheckPenalty && (
          <i className="bi bi-shield-shaded text-secondary me-1" title="Le malus d’armure aux tests s’applique"></i>
        )}
      </Form.Label>
      <Col lg={2} className="pt-2 text-center">
        {skill.isClassSkill && (
          <Form.Check
            type="checkbox"
            id={skill.id + "-class"}
            checked
            disabled
            aria-label={skill.fullName + " - Compétence de classe"}
          />
        )}
      </Col>
      <Col lg={2} className="pt-2 text-center">
        {skill.rankForced && <Form.Check type="checkbox" id={skill.id} disabled={true} checked={true} />}
        {!skill.rankForced && (
          <Form.Check
            type="checkbox"
            id={skill.id}
            disabled={skill.ranks === 0 && availableSkillRanks <= 0}
            checked={skill.ranks > 0}
            onChange={onCheck}
          />
        )}
      </Col>
      <Col lg={2} className="pt-2 text-center">
        {skill.bonus !== undefined && (
          <Badge bg={skill.bonus > 0 ? "primary" : "secondary"}>{displayBonus(skill.bonus)}</Badge>
        )}
        {skill.bonus === undefined && "-"}
      </Col>
    </Form.Group>
  );
}

export function Skills({ character }: CharacterProps) {
  const dispatch = useAppDispatch();

  const selectedRace = character.getRace();
  const selectedTheme = character.getTheme();
  const selectedClass = character.getClass();

  if (!selectedRace || !selectedTheme || !selectedClass) {
    return null;
  }

  const availableSkillRanks = character.getRemainingSkillRanksPoints();

  function handleSkillRankChange(event: ChangeEvent<HTMLInputElement>): void {
    const skillId = event.target.id;
    const checked = event.target.checked;
    dispatch(mutators.updateSkillRank({ id: skillId, delta: checked ? 1 : -1 }));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Compétences</h2>

      <Row>
        <Col></Col>
        <Col lg={2} className="pt-2 text-center">
          Classe
        </Col>
        <Col lg={2} className="pt-2 text-center">
          Rang
        </Col>
        <Col lg={2} className="pt-2 text-center">
          Bonus
        </Col>
      </Row>

      <Row>
        <Col></Col>
        <Col lg={2} className="text-center"></Col>
        <Col lg={2} className="text-center">
          <Form.Control
            title="Rangs de compétence à distribuer"
            type="text"
            className={"text-center " + (availableSkillRanks < 0 && "bg-danger")}
            value={availableSkillRanks}
            disabled
          />
        </Col>
        <Col lg={2}></Col>
      </Row>

      {character.getSkills().map((skill) => (
        <Skill key={skill.id} skill={skill} availableSkillRanks={availableSkillRanks} onCheck={handleSkillRankChange} />
      ))}
    </Stack>
  );
}

export function SkillsModifiers({ character }: CharacterProps) {
  const types = ["skill", "classSkill", "rankSkill"];
  const features = [
    ...character.getSelectedRaceTraits().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...character.getThemeFeatures().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...character.getClassFeatures().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
    ...character.getFeats().filter((f) => f.modifiers.some((m) => types.includes(m.type))),
  ];
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Modificateurs</h2>
      {features.map((feature) => (
        <Card key={isFeat(feature) ? feature.id + "-" + feature.target : feature.id}>
          <Card.Header>
            {feature.name}
            {!isFeat(feature) && feature.category && ` (${categories[feature.category]})`}
          </Card.Header>
          <Card.Body>
            {feature.modifiers
              .filter((m) => types.includes(m.type))
              .map((modifier) => (
                <ModifierComponent key={modifier.id} modifier={modifier} />
              ))}
          </Card.Body>
        </Card>
      ))}
    </Stack>
  );
}

type NewOption = { id: string; name: string; customOption: true };

export function ProfessionSkills() {
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
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Compétences de profession</h2>
      <p className="text-muted">Ajouter une profession à la liste des compétences de ce personnage.</p>
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
      <div></div>
      <Button variant="primary ms-auto" onClick={handleAddProfession} disabled={selectedProfession.length == 0}>
        Ajouter aux compétences
      </Button>
    </Stack>
  );
}
