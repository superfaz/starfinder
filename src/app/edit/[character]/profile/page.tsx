import { Metadata } from "next";
import { isSecure } from "../helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Définition du profil",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const characterId = params.character;
  const returnTo = `/edit/${characterId}/profile`;

  if (await isSecure(returnTo)) {
    return <PageContent />;
  }
}
