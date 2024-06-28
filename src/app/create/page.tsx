import { getSession } from "@auth0/nextjs-auth0";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";

export const metadata: Metadata = {
  title: "Création",
};

export function PageContent() {
  return (
    <>
      <Col lg={6}>
        <Stack direction="vertical" gap={2}>
          <h2>Introduction</h2>
          <p>
            Bienvenue dans le créateur de personnage pour le jeu de rôle <strong>StarFinder</strong> de Paizo
            Publishing.
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
    </>
  );
}

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login?returnTo=/create");
  }

  return <PageContent />;
}
