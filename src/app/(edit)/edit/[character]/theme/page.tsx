import { Metadata } from "next";
import { isSecure } from "app/helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection du thème",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const characterId = params.character;
  const returnTo = `/edit/${characterId}/theme`;

  if (await isSecure(returnTo)) {
    return <PageContent />;
  }
}
