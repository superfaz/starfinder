import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";

export function LayoutAnonymous({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar sticky="top" className="mb-4">
        <Container>
          <NavbarBrand>monperso StarFinder</NavbarBrand>
          <a href="/api/auth/login?lang=fr" className="btn btn-primary">
            Se connecter
          </a>
        </Container>
      </Navbar>
      {children}
    </>
  );
}
