import { displayBonus, findOrError } from "app/helpers";
import { Badge, Card, Form, Stack } from "react-bootstrap";
import { Context } from "./types";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import ModifierComponent from "./ModifierComponent";
import { DataSet } from "data";
import { Character } from "model";
import {
  updateNoThemeAbilityScore,
  updateScholarLabel,
  updateScholarSkill,
  updateScholarSpecialization,
  updateTheme,
} from "logic/Character";

export function TabThemeSelection({
  data,
  character,
  setCharacter,
  addToContext,
}: {
  data: DataSet;
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
  addToContext: (key: string, value: string) => void;
}) {
  const selectedTheme = data.themes.find((r) => r.id === character.theme) || null;

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    setCharacter((character) => updateTheme(data, character, id));

    if (id === "74e471d9-db80-4fae-9610-44ea8eeedcb3") {
      addToContext("scholarSkill", "life");
      addToContext("scholarSpecialization", data.specials.scholar.life[0]);
    }
  }

  function handleNoThemeAbilityChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    setCharacter((character) => updateNoThemeAbilityScore(character, id));
  }

  function handleScholarSkillChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    setCharacter((character) => updateScholarSkill(character, id));
    addToContext("scholarSkill", id);
    addToContext("scholarSpecialization", data.specials.scholar[id][0]);
  }

  function handleScholarSpecializationChange(e: ChangeEvent<HTMLSelectElement>): void {
    let specialization = e.target.value;
    setCharacter((character) => updateScholarSpecialization(character, specialization));
    addToContext("scholarSpecialization", specialization);
  }

  function handleScholarLabelChange(e: ChangeEvent<HTMLInputElement>): void {
    let label = e.target.value;
    setCharacter((character) => updateScholarLabel(character, label));
    addToContext("scholarSpecialization", label);
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Thème</h2>
      <Form.FloatingLabel controlId="theme" label="Thème">
        <Form.Select value={character.theme} onChange={handleThemeChange}>
          {character.theme === "" && <option value=""></option>}
          {data.themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedTheme && character.theme !== "e1a9a6ad-0c95-4f31-a692-3327c77bb53f" && (
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
      {character.theme === "e1a9a6ad-0c95-4f31-a692-3327c77bb53f" && character.themeOptions && (
        <>
          <Form.FloatingLabel controlId="noThemeAbility" label="Choix de la charactérisque">
            <Form.Select value={character.themeOptions.noThemeAbility} onChange={handleNoThemeAbilityChange}>
              {data.abilityScores.map((abilityScore) => (
                <option key={abilityScore.id} value={abilityScore.id}>
                  {abilityScore.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          <Stack direction="horizontal">
            <Badge bg={"primary"}>
              {
                findOrError(
                  data.abilityScores,
                  (a) => character.themeOptions !== undefined && a.id === character.themeOptions.noThemeAbility
                ).code
              }
              {" +1"}
            </Badge>
          </Stack>
        </>
      )}
      {character.theme === "74e471d9-db80-4fae-9610-44ea8eeedcb3" && character.themeOptions && (
        <>
          <Form.FloatingLabel controlId="scholarSkill" label="Choix de la compétence de classe">
            <Form.Select value={character.themeOptions.scholarSkill} onChange={handleScholarSkillChange}>
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
            <Form.Select
              value={character.themeOptions.scholarSpecialization}
              onChange={handleScholarSpecializationChange}
            >
              {data.specials.scholar[character.themeOptions.scholarSkill].map((d) => (
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
            hidden={character.themeOptions.scholarSpecialization !== ""}
          >
            <Form.Control type="text" value={character.themeOptions.scholarLabel} onChange={handleScholarLabelChange} />
          </Form.FloatingLabel>
        </>
      )}
    </Stack>
  );
}

export function TabThemeTraits({
  data,
  character,
  context,
}: {
  data: DataSet;
  character: Character;
  context: Context;
}) {
  const selectedTheme = data.themes.find((r) => r.id === character.theme) || null;

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
