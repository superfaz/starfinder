import { Metadata } from "next";
import { isSecure } from "../helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection de la race",
};

export default async function Page({ params }: { params: { character: string } }) {
  const characterId = params.character;
  const returnTo = `/create/${characterId}/race`;

  if (await isSecure(returnTo)) {
    return <PageContent />;
  }
}
