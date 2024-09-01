"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import { Button, Offcanvas } from "react-bootstrap";
import AuthNavLink from "./AuthNavLink";
import { Nav } from "./components";

export function LayoutAuthenticated({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar expand="lg" sticky="top" className="mb-4">
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
            <Nav.Link href="/" active={pathname === "/"} onClick={handleClose}>
              Accueil
            </Nav.Link>
            <Nav.Link href="/edit" active={pathname.startsWith("/edit")} onClick={handleClose}>
              Vos personnages
            </Nav.Link>
            <Nav.Link href="/create" active={pathname.startsWith("/create")} onClick={handleClose}>
              <i className="bi bi-plus"></i> Création de personnage
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      {children}
    </>
  );
}
