import Link from "next/link";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import Row from "react-bootstrap/Row";
import { Licenses } from "./Licenses";
import { CreateCards } from "./CreateCards";

export function PageContent() {
  return (
    <>
      <Navbar sticky="top">
        <Container>
          <NavbarBrand>monperso StarFinder</NavbarBrand>
          <a href="/api/auth/login?lang=fr" className="btn btn-primary">
            Se connecter
          </a>
        </Container>
      </Navbar>
      <Container>
        <h1 className="display-5">
          Bienvenue à toi,
          <br className="d-block d-lg-none" /> Explorateur des étoiles !
        </h1>
        <Row>
          <Col lg={8} className="mt-5">
            <h3>À propos</h3>
            <p className="lead mb-5">
              Ce site est un outil de gestion de personnages pour le jeu de rôle <strong>Starfinder</strong>. Il a été
              conçu pour faciliter la création et la gestion de personnages pour les joueurs et les maîtres de jeu.
            </p>
            <CreateCards />
          </Col>
          <Col lg={4} className="mt-5">
            <Licenses />
            <hr />
            <Link href="https://github.com/superfaz/starfinder">
              <i className="bi bi-github" aria-label="github" title="github"></i>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
