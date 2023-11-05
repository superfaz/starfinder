"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardText, CardTitle, Col, Row } from "react-bootstrap";

function RaceCard({ race, children }) {
  return (
    <Col>
      <Card className="h-100">
        <Row>
          <Col xs={4}>
            <Card.Img src={"/" + race.id + ".png"} />
          </Col>
          <Col xs={8}>
            <CardBody>
              <CardTitle>{race.name}</CardTitle>
              <CardText>{race.description}</CardText>
              {children}
            </CardBody>
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
        <CardBody>
          <CardTitle>{option.name}</CardTitle>
          <CardText>
            <Modifiers modifiers={option.modifiers} />
            {option.description}
          </CardText>
          {children}
        </CardBody>
      </Card>
    </Col>
  );
}

export function ClientComponent({ races }) {
  const [selectedRace, updateSelectedRace] = useState(null);
  const [selectedOption, updateSelectedOption] = useState(null);

  return (
    <>
      <h2>Choisissez une race</h2>

      <Row xs={1} md={2} className="g-4">
        {!selectedRace &&
          races.map((race) => (
            <RaceCard key={race.id} race={race}>
              <Button onClick={(e) => updateSelectedRace(race)}>Choisir</Button>
            </RaceCard>
          ))}
        {selectedRace && (
          <RaceCard race={selectedRace}>
            <Button
              onClick={(e) => {
                updateSelectedOption(null);
                updateSelectedRace(null);
              }}
            >
              Changer
            </Button>
          </RaceCard>
        )}
      </Row>

      {selectedRace && selectedRace.options && (
        <>
          <h3>Choisissez une option</h3>

          <Row xs={1} md={2} className="g-4">
            {!selectedOption &&
              selectedRace.options.map((option, index) => (
                <OptionCard key={index} option={option}>
                  <Button onClick={(e) => updateSelectedOption(option)}>Choisir</Button>
                </OptionCard>
              ))}
            {selectedOption && (
              <OptionCard option={selectedOption}>
                <Button onClick={(e) => updateSelectedOption(null)}>Changer</Button>
              </OptionCard>
            )}
          </Row>
        </>
      )}

      {selectedRace && selectedRace.traits && (
        <>
          <h2>Traits</h2>

          <Row xs={1} md={2} className="g-4">
            {selectedRace.traits.map((trait, index) => (
              <Col key={index}>
                <h3>{trait.name}</h3>
                <p>{trait.description}</p>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
}
