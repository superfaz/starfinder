import { Metadata } from "next";
import { isSecure } from "app/helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection de la classe",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const characterId = params.character;
  const returnTo = `/edit/${characterId}/class`;

  if (await isSecure(returnTo)) {
    return <PageContent />;
  }
}
