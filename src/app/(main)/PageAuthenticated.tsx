import Link from "next/link";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import type { CharacterView } from "view";
import { Licenses } from "./Licenses";
import { CreateCards } from "./CreateCards";
import { CharacterCard } from "./edit/PageContent";

export function PageAuthenticated({ characters }: Readonly<{ characters: CharacterView[] }>) {
  return (
    <Container>
      <Row>
        <Col lg={8}>
          {characters.length > 0 && (
            <>
              <Stack direction="horizontal" gap={3}>
                <h3>Personnages récents</h3>
                <Link className="btn btn-primary" href="/edit">
                  Voir tous
                </Link>
              </Stack>
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
        <Col lg={4} className="mt-5 mt-lg-0">
          <Licenses />
        </Col>
      </Row>
    </Container>
  );
}
