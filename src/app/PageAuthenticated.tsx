import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import NavLink from "react-bootstrap/NavLink";
import Row from "react-bootstrap/Row";
import { NavbarCollapse, NavbarToggle } from "react-bootstrap";
import AuthNavLink from "./AuthNavLink";
import { Licenses } from "./Licenses";
import { CreateCards } from "./CreateCards";
import { CharacterVM } from "./edit/viewmodel";
import { CharacterCard } from "./edit/PageContent";

export function PageAuthenticated({ characters }: Readonly<{ characters: CharacterVM[] }>) {
  return (
    <>
      <Navbar expand="lg" bg="body-secondary" sticky="top">
        <Container>
          <NavbarToggle aria-controls="navbar-authenticated" />
          <NavbarBrand className="me-auto ms-2">monperso StarFinder</NavbarBrand>
          <NavbarCollapse id="navbar-authenticated">
            <Nav className="me-auto">
              <NavLink href="/">Accueil</NavLink>
            </Nav>
          </NavbarCollapse>
          <Nav>
            <AuthNavLink />
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col lg={8} className="mt-5">
            <h3>Personnages récents</h3>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 mb-5">
              {characters.map((character) => (
                <Col key={character.id} className="mt-3">
                  <CharacterCard character={character} />
                </Col>
              ))}
            </Row>
            <h3>Créer</h3>
            <CreateCards />
          </Col>
          <Col lg={4} className="mt-5">
            <Licenses />
          </Col>
        </Row>
      </Container>
    </>
  );
}
