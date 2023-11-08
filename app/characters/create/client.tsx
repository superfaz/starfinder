"use client";

import { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Race } from "../../types";

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

interface ClientComponentProps {
  races: Race[];
}

export function ClientComponent({ races }: ClientComponentProps) {
  const [selectedRace, updateSelectedRace] = useState(races[0]);
  const [selectedOption, updateSelectedOption] = useState(races[0].options[0]);

  function onRaceChange(e) {
    let id = e.target.value;
    let race = races.find((r) => r.id === id);
    updateSelectedRace(race);
    updateSelectedOption(race.options[0]);
  }

  function onOptionChange(e) {
    let id = e.target.value;
    let option = selectedRace.options.find((o) => o.id === id);
    updateSelectedOption(option);
  }

  return (
    <Row>
      <Col>
        <h2>Profil</h2>
        <Form.Group className="mb-3" controlId="race">
          <Form.Label>Race</Form.Label>
          <Form.Select defaultValue={races[0].id} onChange={onRaceChange}>
            {races.map((race) => (
              <option key={race.id} value={race.id}>
                {race.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <div className="stats">
          <span>PV +{selectedRace.hitPoints}</span>
        </div>
        <p className="text-muted">{races.find((r) => r.id === selectedRace.id).description}</p>

        {selectedRace && selectedRace.options && (
          <>
            <Form.Group className="mb-3" controlId="option">
              <Form.Label>Variante</Form.Label>
              <Form.Select value={selectedOption.id} onChange={onOptionChange}>
                {selectedRace.options.map((option, index) => (
                  <option key={index} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="stats">
              {Object.entries(selectedOption.abilities).map(([key, value]) => (
                <span key={key} className={value > 0 ? null : "down"}>
                  {key} {value > 0 ? "+" : ""}
                  {value}
                </span>
              ))}
            </div>
            <p className="text-muted">{selectedOption.description}</p>
          </>
        )}
        {selectedRace && selectedRace.traits && (
          <>
            <h2>Traits</h2>
            {selectedRace.traits.map((trait, index) => (
              <div key={trait.id}>
                <h3>{trait.name}</h3>
                <p>{trait.description}</p>
              </div>
            ))}
          </>
        )}
      </Col>
      <Col>
        <img alt="" src={"/" + selectedRace.id + "-male.png"} className="img-fluid" />
      </Col>
      <Col></Col>
    </Row>
  );
}
