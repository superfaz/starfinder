import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { isSecure } from "../helpers-server";
import { SpellsSelection } from "./SpellsSelection";

export const metadata: Metadata = {
  title: "Sélection des sorts",
};

export default async function Page({ params }: { params: { character: string } }) {
  const characterId = params.character;
  const returnTo = `/create/${characterId}/spells`;

  if (await isSecure(returnTo)) {
    return (
      <Col lg={12}>
        <SpellsSelection />
      </Col>
    );
  }
}
