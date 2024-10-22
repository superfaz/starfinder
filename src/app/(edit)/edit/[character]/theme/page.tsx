import { Metadata } from "next";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { preparePageContext } from "../helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection du thème",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await preparePageContext(`/edit/${params.character}/theme`, IdSchema, params.character);

  if (!context.success) {
    return serverError(context.error);
  }

  return <PageContent />;
}
