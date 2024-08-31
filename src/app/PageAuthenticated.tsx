"use client";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import Row from "react-bootstrap/Row";
import { Button, Offcanvas } from "react-bootstrap";
import AuthNavLink from "./AuthNavLink";
import { Licenses } from "./Licenses";
import { CreateCards } from "./CreateCards";
import { CharacterVM } from "./edit/viewmodel";
import { CharacterCard } from "./edit/PageContent";
import { useState } from "react";
import { Nav } from "./components";

export function PageAuthenticated({ characters }: Readonly<{ characters: CharacterVM[] }>) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar expand="lg" sticky="top">
        <Container>
          <Button variant="outline-secondary" onClick={handleShow}>
            <i className="bi bi-three-dots-vertical"></i>
          </Button>
          <NavbarBrand className="me-auto ms-2">monperso StarFinder</NavbarBrand>
          <Nav>
            <AuthNavLink />
          </Nav>
        </Container>
      </Navbar>
      <Offcanvas show={show} onHide={handleClose} backdrop="static">
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column me-auto">
            <Nav.Link active href="/">
              Accueil
            </Nav.Link>
            <Nav.Link href="/edit">Vos personnages</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
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
    </>
  );
}
