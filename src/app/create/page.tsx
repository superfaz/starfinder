import { Metadata } from "next";
import { isSecure } from "../edit/[character]/helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Création",
};

export default async function Page() {
  const returnTo = `/create`;

  if (await isSecure(returnTo)) {
    return <PageContent />;
  }
}
