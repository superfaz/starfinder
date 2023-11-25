"use client";

import { ChangeEvent, useState } from "react";
import { Badge, Button, Col, Form, InputGroup, Nav, Row, Stack } from "react-bootstrap";
import { Component } from "../../types";
import { ClientComponentData } from "./types";

function Component({ component }: { component: Component }) {
  switch (component.type) {
    case "ability":
      return (
        <p>
          <Badge bg="primary">Pouvoir</Badge>
          {component.title && <strong className="me-1">{component.title}.</strong>}
          <span className="text-muted">{component.description}</span>
        </p>
      );
    case "savingThrow":
      return (
        <p>
          <Badge bg="primary">Jets de sauvegarde</Badge>
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
          <strong className="me-1">{component.title}.</strong>
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
          <strong>{component.title}</strong>
          {component.description && <span className="ms-1 text-muted">{component.description}</span>}
        </p>
      );
    default:
      return null;
  }
}

export function ClientComponent({ data }: { data: ClientComponentData }) {
  const [selectedRace, updateSelectedRace] = useState(data.races[0]);
  const [selectedOption, updateSelectedOption] = useState(data.races[0].options[0]);
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

  function handleRaceChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    let race = data.races.find((r) => r.id === id);
    updateSelectedRace(race);
    updateSelectedOption(race.options[0]);
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

  return (
    <Row>
      <Col lg={12}>
        <Nav variant="underline" defaultActiveKey="profil">
          <Nav.Item>
            <Nav.Link eventKey="profil">Profil</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Traits</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Caractéristiques</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Compétences</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Équipement</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Sorts</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>Don</Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
      <Col>
        <Stack direction="vertical" gap={2}>
          <h2>Profil</h2>
          <Form.FloatingLabel controlId="race" label="Race">
            <Form.Select value={selectedRace.id} onChange={handleRaceChange}>
              {data.races.map((race) => (
                <option key={race.id} value={race.id}>
                  {race.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          <Stack direction="horizontal">
            <Badge bg="primary">PV +{selectedRace.hitPoints}</Badge>
          </Stack>
          <p className="text-muted">{data.races.find((r) => r.id === selectedRace.id).description}</p>
          {selectedRace.options && (
            <>
              <Form.FloatingLabel controlId="option" label="Variante">
                <Form.Select value={selectedOption.id} onChange={handleOptionChange}>
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

          <hr />

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
      <Col>
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
          <picture>
            <img alt="" src={"/" + selectedRace.id + "-male.png"} width={"50%"} className="img-fluid" />
          </picture>
        </Stack>
      </Col>
      <Col lg={6}>
        <Stack direction="vertical" gap={2}>
          <h2>Traits</h2>
          {selectedRace.traits.map((trait) => (
            <div key={trait.id}>
              <h5>{trait.name}</h5>
              <div className="text-muted">{trait.description}</div>
              {trait.components &&
                trait.components.map((component) => <Component key={component.id} component={component} />)}
            </div>
          ))}

          <hr />

          {selectedTheme.advantages
            .filter((a) => a.level === 1)
            .map((advantage) => (
              <div key={advantage.id}>
                <h5>{advantage.name}</h5>
                <div className="text-muted">{advantage.description}</div>
                {advantage.components &&
                  advantage.components.map((component) => <Component key={component.id} component={component} />)}
              </div>
            ))}
        </Stack>
      </Col>
    </Row>
  );
}
