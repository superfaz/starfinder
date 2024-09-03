import Link from "next/link";
import { Container, Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import { Badge, Card } from "app/components";
import { DataSource, type IDataSource } from "data";
import { Character } from "model";
import { ViewBuilder } from "view/server";
import { CharacterCard } from "../PageContent";

export async function PageContent({ character }: Readonly<{ character: Character }>) {
  const dataSource: IDataSource = new DataSource();
  const builder = new ViewBuilder(dataSource);
  return (
    <Stack direction="vertical" gap={2}>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        <Col className="mt-3">
          <CharacterCard character={await builder.createCharacter(character)} noAction />
        </Col>
      </Row>
      <h3 className="mt-5">Affiliations</h3>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        <Col className="mb-3">
          <Container className="mb-2">
            <Row>
              <Col xs="auto" className="display-5 my-auto text-warning">
                <i className="bi bi-exclamation-diamond"></i>
              </Col>
              <Col className="text-warning">Vous devez choisir la caractéristique principale de votre personnage.</Col>
            </Row>
          </Container>
          <Card data-testid="race">
            <Card.Header>
              <Badge bg="primary">Race</Badge>
              <div className="d-inline-block ms-2">Humains</div>
            </Card.Header>
            <Card.Body></Card.Body>
            <Card.Footer className="align-items-start">
              <Row>
                <Col xs="auto">
                  <Link
                    href={`/edit/${character.id}/race`}
                    className="btn btn-primary stretched-link icon-link icon-link-hover"
                  >
                    Modifier <i className="bi bi-chevron-right mb-1 me-auto"></i>
                  </Link>
                </Col>
                <Col className="small text-muted">
                  Modifiez la race de votre personnage, sélectionnez une variante ou choisissez des traits alternatifs.
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
        <Col className="mb-3">
          <Card data-testid="theme">
            <Card.Header>
              <Badge bg="primary">Thème</Badge>
              <div className="d-inline-block ms-2">Humains</div>
            </Card.Header>
            <Card.Body></Card.Body>
            <Card.Body>
              <Row>
                <Col xs="auto" className="display-5 my-auto text-warning">
                  <i className="bi bi-exclamation-diamond"></i>
                </Col>
                <Col className="text-warning">
                  Vous devez choisir la caractéristique principale de votre personnage.
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="align-items-start">
              <Row>
                <Col xs="auto">
                  <Link href={`/edit/${character.id}/theme`} className="btn btn-primary stretched-link">
                    Modifier <i className="bi bi-chevron-right mb-1 me-auto"></i>
                  </Link>
                </Col>
                <Col className="small text-muted">
                  Modifiez la race de votre personnage, sélectionnez une variante ou choisissez des traits alternatifs.
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
        <Col className="mb-3">
          <Card data-testid="class">
            <Card.Header>
              <Badge bg="primary">Classe</Badge>
              <div className="d-inline-block ms-2">Humains</div>
            </Card.Header>
            <Card.Body></Card.Body>
            <Card.Footer className="align-items-start">
              <Row>
                <Col xs="auto">
                  <Link href={`/edit/${character.id}/class`} className="btn btn-primary stretched-link">
                    Modifier <i className="bi bi-chevron-right mb-1 me-auto"></i>
                  </Link>
                </Col>
                <Col className="small text-muted">
                  Modifiez la race de votre personnage, sélectionnez une variante ou choisissez des traits alternatifs.
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <h3 className="mt-5">Détails</h3>
      <h3 className="mt-5">Equipement</h3>

      <Stack direction="vertical" gap={2} className="mt-5">
        <h2>Introduction</h2>
        <p>
          Bienvenue dans le créateur de personnage pour le jeu de rôle <strong>StarFinder</strong> de Paizo Publishing.
        </p>
        <p>
          Cet assistant va vous permettre de choisir les éléments les plus importants de votre personnage, comme sa{" "}
          <strong>race</strong>, son <strong>thème</strong> et sa <strong>classe</strong> avant de vous guider dans la
          définition de son profil, de son histoire et enfin vers les choix qui lui sont spécifiques comme ses sorts,
          son IA ou ses dons.
        </p>
        <p>
          La version française se base sur les publications éditées par Black Book Editions. Vous pouvez trouver plus
          d&apos;informations sur le jeu sur le site de l&apos;éditeur :{" "}
          <a href="https://www.black-book-editions.fr/catalogue.php?id=519">www.black-book-editions.fr</a>.
        </p>
      </Stack>
    </Stack>
  );
}
