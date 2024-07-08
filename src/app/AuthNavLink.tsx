"use client";

import Container from "react-bootstrap/Container";
import AuthMenu from "./AuthMenu";
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
  }

  return <AuthMenu />;
}
