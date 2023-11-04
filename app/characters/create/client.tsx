"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";

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
            <Button onClick={(e) => updateSelectedRace(null)}>Changer</Button>
          </RaceCard>
        )}
      </Row>
    </>
  );
}
