import Link from "next/link";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import CardLink from "react-bootstrap/CardLink";
import CardText from "react-bootstrap/CardText";
import CardTitle from "react-bootstrap/CardTitle";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import NavLink from "react-bootstrap/NavLink";
import Row from "react-bootstrap/Row";
import AuthNavLink from "./AuthNavLink";

export default function Page() {
  return (
    <>
      <Navbar bg="body-secondary">
        <Container>
          <NavbarBrand>monperso StarFinder</NavbarBrand>
          <Nav className="me-auto">
            <NavLink href="/">Home</NavLink>
          </Nav>
          <Nav>
            <AuthNavLink />
            <NavLink href="https://github.com/superfaz/starfinder">
              <i className="bi bi-github" aria-label="github" title="github"></i>
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <h1 className="display-5 mb-5">
          Bienvenue à toi,
          <br className="d-block d-xl-none" /> Explorateur des étoiles !
        </h1>
        <Row>
          <Col xl={8}>
            <h3>À propos</h3>
            <p className="lead">
              Ce site est un outil de gestion de personnages pour le jeu de rôle <strong>Starfinder</strong>. Il a été
              conçu pour faciliter la création et la gestion de personnages pour les joueurs et les maîtres de jeu.
            </p>
            <Row className="my-5 g-2 row-cols-1 row-cols-md-2 row-cols-lg-3">
              <Col>
                <Card className="h-100 text-bg-primary">
                  <CardBody className="d-flex align-items-start flex-column">
                    <CardTitle>Création libre</CardTitle>
                    <CardText>Créez votre personnage avec un maximum de choix et de possibilités.</CardText>
                    <Link
                      href="/create"
                      className="mt-auto btn btn-outline-dark stretched-link text-light icon-link icon-link-hover"
                    >
                      Démarrer la création <i className="bi bi-chevron-right mb-1"></i>
                    </Link>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card className="h-100">
                  <CardBody className="d-flex align-items-start flex-column">
                    <CardTitle>Basée sur un modèle</CardTitle>
                    <CardText>
                      Choisissez un modèle de personnage et personnalisez celui-ci en fonction de vos envies.
                    </CardText>
                    <CardText>
                      <em>(Non implémenté)</em>
                    </CardText>
                    <CardLink
                      href="/create"
                      className="disabled mt-auto btn btn-outline-primary stretched-link text-light icon-link icon-link-hover"
                    >
                      Démarrer la custo <i className="bi bi-chevron-right mb-1"></i>
                    </CardLink>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card className="h-100">
                  <CardBody className="d-flex align-items-start flex-column">
                    <CardTitle>Pré-tirée</CardTitle>
                    <CardText>
                      Utilisez l&apos;un des personnages pré-tirées pour démarrer directement votre personnage. Vous ne
                      pourrez pas le modifier sauf lors des montés de niveaux.
                    </CardText>
                    <CardText>
                      <em>(Non implémenté)</em>
                    </CardText>
                    <CardLink
                      href="/create"
                      className="disabled mt-auto btn btn-outline-primary stretched-link text-light icon-link icon-link-hover"
                    >
                      Sélection <i className="bi bi-chevron-right mb-1"></i>
                    </CardLink>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xl={4}>
            <h3>Licences</h3>
            <p className="text-muted">
              Ce site utilise des marques déposées et/ou des droits d’auteurs qui sont la propriété de Black Book
              Editions et/ou de Paizo Publishing, LLC comme l’y autorisent les conditions d’utilisation de Black Book
              Editions. Ce site n’est pas publié(e) par Black Book Editions ni Paizo Publishing, LLC et n’a pas reçu son
              aval ni une quelconque approbation de sa part. Pour de plus amples informations sur Black Book Editions,
              consultez{" "}
              <a href="//www.black-book-editions.fr" target="_blank">
                www.black-book-editions.fr
              </a>
            </p>
            <p className="text-muted">
              Pour plus d’informations sur les conditions d’utilisation de la Paizo Community Use Policy, veuillez vous
              rendre sur{" "}
              <a href="//paizo.com/communityuse" target="_blank">
                paizo.com/communityuse
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
