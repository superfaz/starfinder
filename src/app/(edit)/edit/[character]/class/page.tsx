import { Metadata } from "next";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { PageContent } from "./PageContent";
import { prepareContext } from "../helpers-server";

export const metadata: Metadata = {
  title: "Sélection de la classe",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await prepareContext(`/edit/${params.character}/class`, IdSchema, params.character);
  if (!context.success) {
    return serverError(context.error);
  }

  return <PageContent />;
}
