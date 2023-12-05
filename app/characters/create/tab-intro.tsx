import { Stack } from "react-bootstrap";

export default function TabIntro() {
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Introduction</h2>
      <p>
        Bienvenue dans le créateur de personnage pour le jeu de rôle <strong>StarFinder</strong> de Paizo Publishing.
      </p>
      <p>
        La version française se base sur la version publiée par Black Book Editions. Vous pouvez trouver plus
        d&apos;informations sur le jeu sur le site de l&apos;éditeur :{" "}
        <a href="https://www.black-book-editions.fr/catalogue.php?id=519">www.black-book-editions.fr</a>.
      </p>
    </Stack>
  );
}
