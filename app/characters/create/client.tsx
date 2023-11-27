"use client";

import { ChangeEvent, useState } from "react";
import { Badge, Button, Card, Col, Form, InputGroup, Nav, Row, Stack } from "react-bootstrap";
import { Component, Option, Race, Trait } from "../../types";
import { Character, ClientComponentData } from "./types";

function Component({ component }: { component: Component }) {
  switch (component.type) {
    case "ability":
      return (
        <p>
          <Badge bg="primary">Pouvoir</Badge>
          {component.name && <strong className="me-1">{component.name}.</strong>}
          <span className="text-muted">{component.description}</span>
        </p>
      );
    case "savingThrow":
      return (
        <p>
          <Badge bg="primary">Jets de sauvegarde</Badge>
          {component.name && <strong className="me-1">{component.name}.</strong>}
          <span className="text-muted">{component.description}</span>
        </p>
      );
    case "skill":
      return (
        <p>
          <Badge bg="primary">Compétence</Badge>
          <strong>
            {component.target} {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
        </p>
      );
    case "classSkill":
      return (
        <p>
          <Badge bg="primary">Compétence de classe</Badge>
          <strong>{component.target}</strong>
        </p>
      );
    case "featCount":
      return (
        <p>
          <Badge bg="primary">Nombre de Dons</Badge>
          <strong>
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
        </p>
      );
    case "feat":
      return (
        <p>
          <Badge bg="primary">Don</Badge>
          {component.level && component.level > 1 && <Badge bg="primary">Niveau {component.level}</Badge>}
          <strong className="me-1">{component.name}.</strong>
          <span className="text-muted">{component.description}</span>
        </p>
      );
    case "skillRank":
      return (
        <p>
          <Badge bg="primary">Rang de compétence</Badge>
          <strong>
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
        </p>
      );
    case "spell":
      return (
        <p>
          <Badge bg="primary">Sort</Badge>
          <strong>{component.name}</strong>
          {component.description && <span className="ms-1 text-muted">{component.description}</span>}
        </p>
      );
    case "languageCount":
      return (
        <p>
          <Badge bg="primary">Nombre de langue</Badge>
          <strong>
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
        </p>
      );
    default:
      return null;
  }
}

export function ClientComponent({ data }: { data: ClientComponentData }) {
  const [navigation, updateNavigation] = useState("profil");
  const [character, updateCharacter] = useState<Character>({ race: null, raceVariant: null });
  const [selectedRace, updateSelectedRace] = useState<Race>(null);
  const [selectedOption, updateSelectedOption] = useState<Option>(null);
  const [selectedTheme, updateSelectedTheme] = useState(data.themes[0]);
  const [selectedClass, updateSelectedClass] = useState(data.classes[0]);
  const [selectedHumanBonus, updateSelectedHumanBonus] = useState(data.abilityScores[0]);
  const [scholar, updateScholar] = useState({
    skillId: "life",
    specialization: data.specials.scholar.life[0],
    label: "",
  });
  const [alignment, updateAlignment] = useState(data.alignments[0]);
  const [name, updateName] = useState("");

  function handleNavigation(key: string) {
    updateNavigation(key);
  }

  function handleRaceChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    let race = data.races.find((r) => r.id === id);
    updateSelectedRace(race);
    updateSelectedOption(race.options[0]);
    updateCharacter({ ...character, race: id, raceVariant: race.options[0].id });
  }

  function handleHumanBonusChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    let abilityScore = data.abilityScores.find((a) => a.id === id);
    updateSelectedHumanBonus(abilityScore);
  }

  function handleOptionChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    let option = selectedRace.options.find((o) => o.id === id);
    updateSelectedOption(option);
    updateCharacter({ ...character, raceVariant: id });
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    updateName(e.target.value);
  }

  function handleRandomizeName() {
    let index = Math.floor(Math.random() * selectedRace.names.length);
    updateName(selectedRace.names[index]);
  }

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    let theme = data.themes.find((t) => t.id === id);
    updateSelectedTheme(theme);
  }

  function handleClassChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    let classType = data.classes.find((c) => c.id === id);
    updateSelectedClass(classType);
  }

  function handleScholarSkillChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    updateScholar({ ...scholar, skillId: id, specialization: data.specials.scholar[id][0], label: "" });
  }

  function handleScholarSpecializationChange(e: ChangeEvent<HTMLSelectElement>) {
    let specialization = e.target.value;
    updateScholar({ ...scholar, specialization: specialization, label: "" });
  }

  function handleScholarLabelChange(e: ChangeEvent<HTMLInputElement>) {
    let label = e.target.value;
    updateScholar({ ...scholar, label: label });
  }

  function handleAlignmentChange(e: React.ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    let alignment = data.alignments.find((a) => a.id === id);
    updateAlignment(alignment);
  }

  function findReplacedTrait(id: string): Trait | Component {
    let trait = selectedRace.traits.find((t) => t.id === id);
    if (trait) {
      return trait;
    }

    let component = selectedRace.traits
      .map((t) => t.components)
      .flat()
      .find((c) => c.id === id);
    if (component) {
      return component;
    }

    return null;
  }

  return (
    <Row>
      <Col lg={12}>
        <Nav variant="underline" activeKey={navigation} onSelect={handleNavigation}>
          <Nav.Item>
            <Nav.Link eventKey="profil">Profil</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="traits" disabled={selectedRace === null}>
              Traits
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="abilityScores" disabled={selectedRace === null}>
              Caractéristiques
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="skills" disabled={selectedRace === null}>
              Compétences
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="equipment" disabled={selectedRace === null}>
              Équipement
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="spells" disabled={selectedRace === null}>
              Sorts
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="feats" disabled={selectedRace === null}>
              Don
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="debug">Debug</Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
      <Col hidden={navigation !== "profil"}>
        <Stack direction="vertical" gap={2}>
          <h2>Profil</h2>
          <Form.FloatingLabel controlId="race" label="Race">
            <Form.Select value={character.race} onChange={handleRaceChange}>
              {character.race === null && <option value=""></option>}
              {data.races.map((race) => (
                <option key={race.id} value={race.id}>
                  {race.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          {selectedRace && (
            <>
              <Stack direction="horizontal">
                <Badge bg="primary">PV +{selectedRace.hitPoints}</Badge>
              </Stack>
              <p className="text-muted">{selectedRace.description}</p>
              {selectedRace.options && (
                <>
                  <Form.FloatingLabel controlId="option" label="Variante">
                    <Form.Select value={character.raceVariant} onChange={handleOptionChange}>
                      {selectedRace.options.map((option, index) => (
                        <option key={index} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.FloatingLabel>
                  {(selectedRace.id !== "humans" || selectedOption.id !== "standard") && (
                    <Stack direction="horizontal">
                      {Object.entries(selectedOption.abilityScores).map(([key, value]) => (
                        <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                          {key} {value > 0 ? "+" : ""}
                          {value}
                        </Badge>
                      ))}
                    </Stack>
                  )}
                  {selectedRace.id === "humans" && selectedOption.id === "standard" && (
                    <>
                      <Form.FloatingLabel controlId="humanBonus" label="Choix de la charactérisque">
                        <Form.Select value={selectedHumanBonus.id} onChange={handleHumanBonusChange}>
                          {data.abilityScores.map((abilityScore) => (
                            <option key={abilityScore.id} value={abilityScore.id}>
                              {abilityScore.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.FloatingLabel>
                      <Stack direction="horizontal">
                        <Badge bg="primary">{selectedHumanBonus.code} +2</Badge>
                      </Stack>
                    </>
                  )}
                  {selectedOption.description && <p className="text-muted">{selectedOption.description}</p>}
                </>
              )}
            </>
          )}

          <hr />

          <Form.FloatingLabel controlId="theme" label="Thème">
            <Form.Select value={selectedTheme.id} onChange={handleThemeChange}>
              {data.themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          <Stack direction="horizontal">
            {Object.entries(selectedTheme.abilityScores).map(([key, value]) => (
              <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                {key} {value > 0 ? "+" : ""}
                {value}
              </Badge>
            ))}
          </Stack>
          {selectedTheme.id === "74e471d9-db80-4fae-9610-44ea8eeedcb3" && (
            <>
              <Form.FloatingLabel controlId="scholarSkill" label="Choix de la compétence de classe">
                <Form.Select value={scholar.skillId} onChange={handleScholarSkillChange}>
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
                <Form.Select value={scholar.specialization} onChange={handleScholarSpecializationChange}>
                  {data.specials.scholar[scholar.skillId].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="">Autre domaine</option>
                </Form.Select>
              </Form.FloatingLabel>
              <Form.FloatingLabel
                controlId="scholarOther"
                label="Domaine de spécialité"
                hidden={scholar.specialization !== ""}
              >
                <Form.Control type="text" value={scholar.label} onChange={handleScholarLabelChange} />
              </Form.FloatingLabel>
            </>
          )}
          <p className="text-muted">{selectedTheme.description}</p>

          <hr />

          <Form.FloatingLabel controlId="class" label="Classe">
            <Form.Select value={selectedClass.id} onChange={handleClassChange}>
              {data.classes.map((classType) => (
                <option key={classType.id} value={classType.id}>
                  {classType.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          <Stack direction="horizontal">
            <Badge bg="primary">{selectedClass.keyAbilityScore}</Badge>
            <Badge bg="primary">EN +{selectedClass.staminaPoints}</Badge>
            <Badge bg="primary">PV +{selectedClass.hitPoints}</Badge>
          </Stack>
          <p className="text-muted">{selectedClass.description}</p>
        </Stack>
      </Col>
      <Col hidden={navigation !== "profil"}>
        <Stack direction="vertical" gap={2}>
          <h2>Concept</h2>
          <InputGroup>
            <Form.FloatingLabel controlId="name" label="Nom du personnage">
              <Form.Control type="text" value={name} onChange={handleNameChange} />
            </Form.FloatingLabel>
            <Button variant="outline-secondary" onClick={handleRandomizeName}>
              <i className="bi-shuffle"></i>
            </Button>
          </InputGroup>
          <Form.FloatingLabel controlId="name" label="Sexe">
            <Form.Control type="text" />
          </Form.FloatingLabel>
          {selectedRace && (
            <Card>
              <picture>
                <img alt="" src={"/" + selectedRace.id + "-male.png"} className="img-fluid" />
              </picture>
            </Card>
          )}
          <Form.FloatingLabel controlId="alignment" label="Alignement">
            <Form.Select value={alignment.id} onChange={handleAlignmentChange}>
              {data.alignments.map((alignment) => (
                <option key={alignment.id} value={alignment.id}>
                  {alignment.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
        </Stack>
      </Col>
      <Col lg={6} hidden={navigation !== "profil" && navigation !== "traits"}>
        <Stack direction="vertical" gap={2}>
          {selectedRace && (
            <>
              <h2>Traits</h2>
              {selectedRace.traits.map((trait) => (
                <div key={trait.id}>
                  <h5>{trait.name}</h5>
                  <p className="text-muted">{trait.description}</p>
                  {trait.components &&
                    trait.components.map((component) => <Component key={component.id} component={component} />)}
                </div>
              ))}
            </>
          )}

          <hr />

          {selectedTheme.advantages
            .filter((a) => a.level === 1)
            .map((advantage) => (
              <div key={advantage.id}>
                <h5>{advantage.name}</h5>
                <p className="text-muted">{advantage.description}</p>
                {advantage.components &&
                  advantage.components.map((component) => <Component key={component.id} component={component} />)}
              </div>
            ))}
        </Stack>
      </Col>
      <Col lg={6} hidden={navigation !== "traits"}>
        <Stack direction="vertical" gap={2}>
          {selectedRace && (
            <>
              <h2>Traits secondaires</h2>
              {selectedRace.secondaryTraits &&
                selectedRace.secondaryTraits.map((trait) => (
                  <div key={trait.id}>
                    <h5>
                      <Form.Switch label={trait.name} />
                    </h5>
                    <div>
                      <span>Remplace : </span>
                      {trait.replace.map((r) => findReplacedTrait(r)?.name).join(", ")}
                    </div>
                    <p className="text-muted">{trait.description}</p>
                    {trait.components &&
                      trait.components.map((component) => <Component key={component.id} component={component} />)}
                  </div>
                ))}
            </>
          )}
        </Stack>
      </Col>
      <Col lg={12} hidden={navigation !== "debug"}>
        <pre>{JSON.stringify(character, null, 2)}</pre>
      </Col>
    </Row>
  );
}
