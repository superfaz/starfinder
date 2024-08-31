import { Metadata } from "next";
import { isSecure } from "./helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Création",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const characterId = params.character;
  const returnTo = `/edit/${characterId}`;

  if (await isSecure(returnTo)) {
    return <PageContent />;
  }
}
