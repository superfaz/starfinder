import { Character } from "model";
import { Button, ButtonGroup, Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import { CharacterCard } from "../PageContent";
import { toViewModel } from "../viewmodel";
import { DataSource, type IDataSource } from "data";

export async function PageContent({ character }: Readonly<{ character: Character }>) {
  const dataSource: IDataSource = new DataSource();
  return (
    <Col lg={6}>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        <Col className="mt-3">
          <CharacterCard character={await toViewModel(dataSource, character)} noAction />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Stack direction="vertical">
            <h3 className="mt-5">Affiliations</h3>
            <Button className="me-auto">
              <i className="bi bi-exclamation-diamond"></i>
            </Button>
            <ButtonGroup>
              <Button className="me-auto">
                <i className="bi bi-exclamation-diamond"></i>
              </Button>
              <Button className="me-auto">
                <i className="bi bi-exclamation-diamond"></i>
              </Button>
              <Button>Race</Button>
            </ButtonGroup>
          </Stack>
        </Col>
        <Col xs={12}>
          <h3 className="mt-5">Détails</h3>
        </Col>
        <Col xs={12}>
          <h3 className="mt-5">Equipement</h3>
        </Col>
      </Row>
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
    </Col>
  );
}
