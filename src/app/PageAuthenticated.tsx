import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Licenses } from "./Licenses";
import { CreateCards } from "./CreateCards";
import { CharacterVM } from "./edit/viewmodel";
import { CharacterCard } from "./edit/PageContent";

export function PageAuthenticated({ characters }: Readonly<{ characters: CharacterVM[] }>) {
  return (
    <Container>
      <Row>
        <Col lg={8} className="mt-5">
          {characters.length > 0 && (
            <>
              <h3>Personnages récents</h3>
              <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 mb-5">
                {characters.map((character) => (
                  <Col key={character.id} className="mt-3">
                    <CharacterCard character={character} />
                  </Col>
                ))}
              </Row>
            </>
          )}
          <h3>Créer</h3>
          <CreateCards />
        </Col>
        <Col lg={4} className="mt-5">
          <Licenses />
        </Col>
      </Row>
    </Container>
  );
}
