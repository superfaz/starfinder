import { Metadata } from "next";
import { IdSchema } from "model";
import { serverError } from "navigation";
import { PageContent } from "./PageContent";
import { preparePageContext } from "../helpers-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Debug",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const context = await preparePageContext(`/edit/${params.character}/debug`, IdSchema, params.character);
  if (!context.success) {
    return serverError(context.error);
  }

  return <PageContent />;
}
