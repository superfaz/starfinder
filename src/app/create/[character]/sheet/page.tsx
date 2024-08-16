import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { isSecure } from "../helpers-server";
import { PageClient } from "./PageClient";

export const metadata: Metadata = {
  title: "Fiche de personnage",
};

export default async function Page({ params }: { params: { character: string } }) {
  const characterId = params.character;
  const returnTo = `/create/${characterId}/sheet`;

  if (await isSecure(returnTo)) {
    return (
      <Col lg={12}>
        <PageClient />
      </Col>
    );
  }
}
