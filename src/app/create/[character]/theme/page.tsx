import { Metadata } from "next";
import { isSecure } from "../helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection du thème",
};

export default async function Page({ params }: { params: { character: string } }) {
  const characterId = params.character;
  const returnTo = `/create/${characterId}/theme`;

  if (await isSecure(returnTo)) {
    return <PageContent />;
  }
}
