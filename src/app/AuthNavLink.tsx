"use client";

import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useKindeBrowserClient } from "./kinde";

export default function AuthNavLink() {
  const { user, isLoading } = useKindeBrowserClient();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Container fluid>
        <a href="/api/auth/login?lang=fr" className="btn btn-primary">
          Se connecter
        </a>
      </Container>
    );
  } else {
    return (
      <NavDropdown title={user.given_name} id="user-nav-dropdown" align={"end"}>
        <NavDropdown.Item href="/api/auth/logout">Se déconnecter</NavDropdown.Item>
      </NavDropdown>
    );
  }
}
