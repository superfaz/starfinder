import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Licenses } from "./Licenses";
import { CreateCards } from "./CreateCards";

export function PageContent() {
  return (
    <Container>
      <h1 className="display-5 mb-5">
        Bienvenue à toi,
        <br className="d-block d-lg-none" /> Explorateur des étoiles !
      </h1>
      <Row>
        <Col lg={8}>
          <h3>À propos</h3>
          <p className="lead mb-5">
            Ce site est un outil de gestion de personnages pour le jeu de rôle <strong>Starfinder</strong>. Il a été
            conçu pour faciliter la création et la gestion de personnages pour les joueurs et les maîtres de jeu.
          </p>
          <CreateCards />
        </Col>
        <Col lg={4} className="mt-5 mt-lg-0">
          <Licenses />
        </Col>
      </Row>
    </Container>
  );
}
