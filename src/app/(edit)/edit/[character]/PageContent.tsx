import clsx from "clsx";
import Link from "next/link";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { IAdvisorResult } from "logic";
import { Card } from "ui";
import { CharacterDetailedView, convert } from "view/server";
import { CharacterCard } from "app/(main)/edit/PageContent";

function Block({
  id,
  code,
  title,
  entry,
  alert,
  disabled = false,
}: Readonly<{
  id: string;
  code: string;
  title: string;
  entry?: { name: string; description: string };
  alert?: string;
  disabled?: boolean;
}>) {
  return (
    <Stack direction="vertical" gap={2} data-testid={code}>
      <h3 className="mt-4">{title}</h3>
      <Card>
        {entry && (
          <Card.Body>
            <Card.Title>{entry.name}</Card.Title>
            <Card.Text className="text-muted">{entry.description}</Card.Text>
          </Card.Body>
        )}
        {!entry && (
          <Card.Body>
            <Card.Text className="fst-italic">Aucune sélection</Card.Text>
          </Card.Body>
        )}
        {alert && (
          <Card.Body className="d-flex flex-row align-items-center text-warning-emphasis bg-warning-subtle">
            <i
              className="bi display-5 bi-exclamation-diamond flex-shrink-0 me-2"
              role="img"
              aria-label="Attention:"
            ></i>
            <div>{alert}</div>
          </Card.Body>
        )}
        <Card.Footer>
          <Link
            href={`/edit/${id}/${code}`}
            className={clsx("btn btn-primary icon-link stretched-link icon-link-hover", { disabled })}
          >
            Configurer <i className="bi bi-chevron-right mb-1 me-auto"></i>
          </Link>
        </Card.Footer>
      </Card>
    </Stack>
  );
}

export async function PageContent({
  character,
  alerts,
}: Readonly<{ character: CharacterDetailedView; alerts: IAdvisorResult }>) {
  return (
    <Stack direction="vertical" gap={2}>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        <Col className="mt-3">
          <CharacterCard character={convert(character)} noAction />
        </Col>
      </Row>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        <Col className="mb-3">
          <Block id={character.id} code="race" title="Race" entry={character.race} alert={alerts.race} />
        </Col>
        <Col className="mb-3">
          <Block id={character.id} code="theme" title="Thème" entry={character.theme} disabled={!character.race} />
        </Col>
        <Col className="mb-3">
          <Block id={character.id} code="class" title="Classe" entry={character.class} disabled={!character.theme} />
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
