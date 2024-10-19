import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { prepareContext } from "../helpers-server";
import { PageClient } from "./PageClient";

export const metadata: Metadata = {
  title: "Fiche de personnage",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await prepareContext(`/edit/${params.character}/sheet`, IdSchema, params.character);

  if (!context.success) {
    return serverError(context.error);
  }

  return (
    <Col lg={12}>
      <PageClient />
    </Col>
  );
}
