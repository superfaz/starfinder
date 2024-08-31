import Link from "next/link";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Card } from "./components";

export function CreateCards() {
  return (
    <Row className="g-2 row-cols-1 row-cols-sm-2 row-cols-md-3">
      <Col>
        <Card className="h-100 text-bg-primary">
          <Card.Body className="d-flex align-items-start flex-column">
            <Card.Title>Création libre</Card.Title>
            <Card.Text>Créez votre personnage avec un maximum de choix et de possibilités.</Card.Text>
            <Link
              href="/edit"
              className="mt-auto btn btn-outline-dark stretched-link text-light icon-link icon-link-hover"
            >
              Démarrer la création <i className="bi bi-chevron-right mb-1"></i>
            </Link>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="h-100">
          <Card.Body className="d-flex align-items-start flex-column">
            <Card.Title>Basée sur un modèle</Card.Title>
            <Card.Text>
              Choisissez un modèle de personnage et personnalisez celui-ci en fonction de vos envies.
            </Card.Text>
            <Card.Text>
              <em>(Non implémenté)</em>
            </Card.Text>
            <Link
              href="/edit"
              className="disabled mt-auto btn btn-outline-primary stretched-link text-light icon-link icon-link-hover"
            >
              Démarrer la custo <i className="bi bi-chevron-right mb-1"></i>
            </Link>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="h-100">
          <Card.Body className="d-flex align-items-start flex-column">
            <Card.Title>Pré-tirée</Card.Title>
            <Card.Text>
              Utilisez l&apos;un des personnages pré-tirés pour démarrer directement votre personnage. Vous ne pourrez
              pas le modifier sauf lors des montés de niveaux.
            </Card.Text>
            <Card.Text>
              <em>(Non implémenté)</em>
            </Card.Text>
            <Link
              href="/edit"
              className="disabled mt-auto btn btn-outline-primary stretched-link text-light icon-link icon-link-hover"
            >
              Sélection <i className="bi bi-chevron-right mb-1"></i>
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
