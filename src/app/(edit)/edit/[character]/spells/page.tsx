import { Metadata } from "next";
import Col from "react-bootstrap/Col";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { prepareContext } from "../helpers-server";
import { SpellsSelection } from "./SpellsSelection";

export const metadata: Metadata = {
  title: "Sélection des sorts",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await prepareContext(`/edit/${params.character}/spells`, IdSchema, params.character);

  if (!context.success) {
    return serverError(context.error);
  }

  return (
    <Col lg={12}>
      <SpellsSelection />
    </Col>
  );
}
