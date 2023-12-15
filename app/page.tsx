import Link from "next/link";
import { Col, Row } from "react-bootstrap";

export default function Page() {
  return (
    <>
      <h1>Bienvenue !</h1>
      <Link href="/characters/create" className="btn btn-primary">
        Créer un personnage
      </Link>
      <Row>
        <Col lg={6}>
          <h3>Licences</h3>
          <p>
            Ce site utilise des marques déposées et/ou des droits d’auteurs qui sont la propriété de Black Book Editions
            et/ou de Paizo Publishing, LLC comme l’y autorisent les conditions d’utilisation de Black Book Editions. Ce
            site n’est pas publié(e) par Black Book Editions ni Paizo Publishing, LLC et n’a pas reçu son aval ni une
            quelconque approbation de sa part. Pour de plus amples informations sur Black Book Editions, consultez
            <a href="//www.black-book-editions.fr" target="_blank">
              www.black-book-editions.fr
            </a>
            .
          </p>
          <p>
            Pour plus d’informations sur les conditions d’utilisation de la Paizo Community Use Policy, veuillez vous
            rendre sur{" "}
            <a href="//paizo.com/communityuse" target="_blank">
              paizo.com/communityuse
            </a>
            .
          </p>
        </Col>
      </Row>
    </>
  );
}
