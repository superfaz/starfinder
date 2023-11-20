"use client";

import { useState } from "react";
import { Badge, Button, Card, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { Class, Component, Race, Theme } from "../../types";

function RaceCard({ race, children }) {
  return (
    <Col>
      <Card className="h-100">
        <Row>
          <Col xs={4}>
            <Card.Img src={"/" + race.id + "-mini.png"} />
          </Col>
          <Col xs={8}>
            <Card.Body>
              <Card.Title>{race.name}</Card.Title>
              <Card.Text>{race.description}</Card.Text>
              {children}
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

interface ModifiersProps {
  modifiers: Record<string, number>;
}

function Modifiers({ modifiers }: ModifiersProps) {
  return (
    <div className="modifiers position-absolute top-0 end-0">
      {Object.entries(modifiers).map(([key, value]) => (
        <span key={key} className="badge bg-secondary me-1">
          {key} {value > 0 ? "+" : ""}
          {value}
        </span>
      ))}
    </div>
  );
}

function OptionCard({ option, children }) {
  return (
    <Col>
      <Card className="h-100">
        <Card.Body>
          <Card.Title>{option.name}</Card.Title>
          <Card.Text>
            <Modifiers modifiers={option.modifiers} />
            {option.description}
          </Card.Text>
          {children}
        </Card.Body>
      </Card>
    </Col>
  );
}

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

interface ClientComponentProps {
  races: Race[];
  themes: Theme[];
  classes: Class[];
}

export function ClientComponent({ races, themes, classes }: ClientComponentProps) {
  const [selectedRace, updateSelectedRace] = useState(races[0]);
  const [selectedOption, updateSelectedOption] = useState(races[0].options[0]);
  const [name, updateName] = useState("");
  const [selectedTheme, updateSelectedTheme] = useState(themes[0]);
  const [selectedClass, updateSelectedClass] = useState(classes[0]);

  function handleRaceChange(e) {
    let id = e.target.value;
    let race = races.find((r) => r.id === id);
    updateSelectedRace(race);
    updateSelectedOption(race.options[0]);
  }

  function handleOptionChange(e) {
    let id = e.target.value;
    let option = selectedRace.options.find((o) => o.id === id);
    updateSelectedOption(option);
  }

  function handleNameChange(e) {
    updateName(e.target.value);
  }

  function handleRandomizeName() {
    let index = Math.floor(Math.random() * selectedRace.names.length);
    updateName(selectedRace.names[index]);
  }

  function handleThemeChange(e) {
    let id = e.target.value;
    let theme = themes.find((t) => t.id === id);
    updateSelectedTheme(theme);
  }

  function handleClassChange(e) {
    let id = e.target.value;
    let classType = classes.find((c) => c.id === id);
    updateSelectedClass(classType);
  }

  return (
    <Row>
      <Col>
        <h2>Profil</h2>
        <Form.FloatingLabel controlId="race" label="Race">
          <Form.Select defaultValue={races[0].id} onChange={handleRaceChange}>
            {races.map((race) => (
              <option key={race.id} value={race.id}>
                {race.name}
              </option>
            ))}
          </Form.Select>
        </Form.FloatingLabel>
        <Stack direction="horizontal" className="mt-2">
          <Badge bg="primary">PV +{selectedRace.hitPoints}</Badge>
        </Stack>
        <p className="text-muted mt-2">{races.find((r) => r.id === selectedRace.id).description}</p>

        {selectedRace && selectedRace.options && (
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
            <Stack direction="horizontal" className="mt-2">
              {Object.entries(selectedOption.abilityScores).map(([key, value]) => (
                <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                  {key} {value > 0 ? "+" : ""}
                  {value}
                </Badge>
              ))}
            </Stack>
            <p className="text-muted">{selectedOption.description}</p>
          </>
        )}

        <InputGroup>
          <Form.FloatingLabel className="mb-3" controlId="name" label="Nom du personnage">
            <Form.Control type="text" value={name} onChange={handleNameChange} />
          </Form.FloatingLabel>
          <Button variant="outline-secondary" onClick={handleRandomizeName}>
            <i className="bi-shuffle"></i>
          </Button>
        </InputGroup>

        <Form.FloatingLabel controlId="theme" label="Thème">
          <Form.Select value={selectedTheme.id} onChange={handleThemeChange}>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </Form.Select>
        </Form.FloatingLabel>
        <Stack direction="horizontal" className="mt-2">
          {Object.entries(selectedTheme.abilityScores).map(([key, value]) => (
            <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
              {key} {value > 0 ? "+" : ""}
              {value}
            </Badge>
          ))}
        </Stack>
        <p className="text-muted">{selectedTheme.description}</p>

        <Form.FloatingLabel controlId="class" label="Classe">
          <Form.Select value={selectedClass.id} onChange={handleClassChange}>
            {classes.map((classType) => (
              <option key={classType.id} value={classType.id}>
                {classType.name}
              </option>
            ))}
          </Form.Select>
        </Form.FloatingLabel>
        <Stack direction="horizontal" className="mt-2">
          <Badge bg="primary">{selectedClass.keyAbilityScore}</Badge>
          <Badge bg="primary">EN +{selectedClass.staminaPoints}</Badge>
          <Badge bg="primary">PV +{selectedClass.hitPoints}</Badge>
        </Stack>
        <p className="text-muted">{selectedClass.description}</p>
      </Col>
      <Col>
        <picture>
          <img alt="" src={"/" + selectedRace.id + "-male.png"} className="img-fluid" />
        </picture>
      </Col>
      <Col>
        <h3>Traits</h3>
        {selectedRace.traits.map((trait) => (
          <div key={trait.id}>
            <h5>{trait.name}</h5>
            <p className="text-muted">{trait.description}</p>
            {trait.components &&
              trait.components.map((component) => <Component key={component.id} component={component} />)}
          </div>
        ))}
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
      </Col>
    </Row>
  );
}
