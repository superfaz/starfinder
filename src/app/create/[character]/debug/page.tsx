import { Metadata } from "next";
import { isSecure } from "../helpers-server";
import { PageContent } from "./PageContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Debug",
};

export default async function Page({ params }: { params: { character: string } }) {
  const characterId = params.character;
  const returnTo = `/create/${characterId}/debug`;

  if (await isSecure(returnTo)) {
    return <PageContent />;
  }
}
