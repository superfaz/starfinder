import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { isSecure } from "app/helpers-server";
import { SpellsSelection } from "./SpellsSelection";

export const metadata: Metadata = {
  title: "Sélection des sorts",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const characterId = params.character;
  const returnTo = `/edit/${characterId}/spells`;

  if (await isSecure(returnTo)) {
    return (
      <Col lg={12}>
        <SpellsSelection />
      </Col>
    );
  }
}
