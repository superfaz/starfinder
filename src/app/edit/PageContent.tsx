"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Badge, Card } from "app/components";
import { CharacterVM } from "./viewmodel";
import { deleteCharacter } from "./actions";

export function CharacterCard({ character }: { character: CharacterVM }) {
  const [show, setShow] = useState(false);

  function handleDelete() {
    setShow(true);
  }

  function handleCancel() {
    setShow(false);
  }

  async function handleConfirm() {
    const deleteCharacterWithId = deleteCharacter.bind(null, character.id);
    await deleteCharacterWithId();
  }

  return (
    <Card>
      <Row className="g-0">
        <Col xs={3}>
          {character.avatar && (
            <picture>
              <img className="img-fluid rounded-start m-1" src={character.avatar} alt="" />
            </picture>
          )}
        </Col>
        <Col>
          <Card.Body>
            <Card.Title>{character.name}</Card.Title>
            <Card.Text>
              {character.race && <Badge bg="primary">{character.race}</Badge>}
              {character.theme && <Badge bg="primary">{character.theme}</Badge>}
              {character.class && <Badge bg="primary">{character.class}</Badge>}
              {character.class && <Badge bg="secondary">{character.level}</Badge>}
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
      <Card.Footer className="d-flex">
        <Link className="card-link btn btn-primary flex-fill" href={`/edit/${character.id}`}>
          Modifier
        </Link>
        <ButtonGroup className="ms-2">
          {!show && (
            <Button variant="danger" aria-label="Supprimer" onClick={handleDelete}>
              <i className="bi bi-trash"></i>
            </Button>
          )}
          {show && (
            <>
              <Button
                variant="outline-danger"
                className="position-relative"
                aria-label="Annuler"
                onClick={handleCancel}
              >
                <i className="bi bi-trash position-absolute"></i>
                <i className="bi bi-slash-lg"></i>
              </Button>
              <Button variant="danger" aria-label="Confirmer la suppression" onClick={handleConfirm}>
                Confirmer
              </Button>
            </>
          )}
        </ButtonGroup>
      </Card.Footer>
    </Card>
  );
}

export function PageContent({ characters }: { characters: CharacterVM[] }) {
  return (
    <Container>
      <h2>Vos personnages</h2>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 mb-5">
        {characters.map((character) => (
          <Col key={character.id} className="mt-3">
            <CharacterCard character={character} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
