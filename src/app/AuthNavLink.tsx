"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function AuthNavLink() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!user) {
    return (
      <Container fluid>
        <a href="/api/auth/login" className="btn btn-primary">
          Se connecter
        </a>
      </Container>
    );
  }

  return (
    <NavDropdown title={user.nickname} id="user-nav-dropdown">
      <NavDropdown.Item href="/api/auth/logout">Se déconnecter</NavDropdown.Item>
    </NavDropdown>
  );
}
