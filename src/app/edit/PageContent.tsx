import { Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { CharacterVM } from "./viewmodel";
import { Badge, Card } from "app/components";

export function PageContent({ characters }: { characters: CharacterVM[] }) {
  return (
    <Container>
      <h2>Vos personnages</h2>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 mb-5">
        {characters.map((character) => (
          <Col key={character.id} className="mt-3">
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
                <Button className="card-link flex-fill" href={`/edit/${character.id}`}>
                  Modifier
                </Button>
                <Button className="card-link" variant="danger" href={`/edit/${character.id}`} aria-label="Supprimer">
                  <i className="bi bi-trash"></i>
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
