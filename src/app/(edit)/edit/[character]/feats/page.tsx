import { Metadata } from "next";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { prepareContext } from "../helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection des dons",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await prepareContext(`/edit/${params.character}/feats`, IdSchema, params.character);

  if (!context.success) {
    return serverError(context.error);
  }

  return <PageContent />;
}
