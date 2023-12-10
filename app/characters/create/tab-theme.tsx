import { ChangeEvent } from "react";
import { Badge, Card, Form, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { DataSet } from "data";
import { CharacterMutators, CharacterPresenter } from "logic";
import { Context } from "./types";
import ModifierComponent from "./ModifierComponent";

export interface CharacterTabProps {
  data: DataSet;
  character: CharacterPresenter;
  mutators: CharacterMutators;
}

export function TabThemeSelection({
  data,
  character,
  mutators,
  addToContext,
}: {
  data: DataSet;
  character: CharacterPresenter;
  mutators: CharacterMutators;
  addToContext: (key: string, value: string) => void;
}) {
  const selectedTheme = character.getTheme();
  const scholarDetails = character.getScholarDetails();

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    mutators.updateTheme(id);

    if (id === "74e471d9-db80-4fae-9610-44ea8eeedcb3") {
      addToContext("scholarSkill", "life");
      addToContext("scholarSpecialization", data.specials.scholar.life[0]);
    }
  }

  function handleNoThemeAbilityChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    mutators.updateNoThemeAbilityScore(id);
  }

  function handleScholarSkillChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    mutators.updateScholarSkill(id);
    addToContext("scholarSkill", id);
    addToContext("scholarSpecialization", data.specials.scholar[id][0]);
  }

  function handleScholarSpecializationChange(e: ChangeEvent<HTMLSelectElement>): void {
    const specialization = e.target.value;
    mutators.updateScholarSpecialization(specialization);
    addToContext("scholarSpecialization", specialization);
  }

  function handleScholarLabelChange(e: ChangeEvent<HTMLInputElement>): void {
    const label = e.target.value;
    mutators.updateScholarLabel(label);
    addToContext("scholarSpecialization", label);
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Thème</h2>
      <Form.FloatingLabel controlId="theme" label="Thème">
        <Form.Select value={selectedTheme?.id || ""} onChange={handleThemeChange}>
          {selectedTheme === null && <option value=""></option>}
          {data.themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedTheme && !character.hasNoTheme() && (
        <Stack direction="horizontal">
          {Object.entries(selectedTheme.abilityScores).map(([key, value]) => (
            <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
              {findOrError(data.abilityScores, (a) => a.id === key).code}
              {displayBonus(value)}
            </Badge>
          ))}
        </Stack>
      )}
      {selectedTheme && <p className="text-muted">{selectedTheme.description}</p>}
      {character.hasNoTheme() && (
        <>
          <Form.FloatingLabel controlId="noThemeAbility" label="Choix de la charactérisque">
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
      )}
      {character.isScholar() && scholarDetails && (
        <>
          <Form.FloatingLabel controlId="scholarSkill" label="Choix de la compétence de classe">
            <Form.Select value={scholarDetails.skill} onChange={handleScholarSkillChange}>
              {data.skills
                .filter((s) => s.id === "life" || s.id === "phys")
                .map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
            </Form.Select>
          </Form.FloatingLabel>
          <Form.FloatingLabel controlId="scholarSpecialization" label="Choix de la spécialité">
            <Form.Select value={scholarDetails.specialization} onChange={handleScholarSpecializationChange}>
              {data.specials.scholar[scholarDetails.skill].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
              <option value="">Autre domaine</option>
            </Form.Select>
          </Form.FloatingLabel>
          <Form.FloatingLabel
            controlId="scholarLabel"
            label="Domaine de spécialité"
            hidden={scholarDetails.specialization !== ""}
          >
            <Form.Control type="text" value={scholarDetails.label} onChange={handleScholarLabelChange} />
          </Form.FloatingLabel>
        </>
      )}
    </Stack>
  );
}

export function TabThemeTraits({ character, context }: { character: CharacterPresenter; context: Context }) {
  const selectedTheme = character.getTheme();

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Traits thématiques</h2>
      {selectedTheme &&
        selectedTheme.features.map((feature) => (
          <Card key={feature.id}>
            <Card.Header>
              <Badge bg="secondary">niveau {feature.level}</Badge>
              {feature.name}
            </Card.Header>
            <Card.Body>
              {feature.description && <p className="text-muted">{feature.description}</p>}
              {feature.modifiers &&
                feature.modifiers.map((modifier) => (
                  <ModifierComponent key={modifier.id} modifier={modifier} context={context} />
                ))}
            </Card.Body>
          </Card>
        ))}
    </Stack>
  );
}
