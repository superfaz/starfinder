import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewBuilder } from "view/server";
import { isSecure } from "app/helpers-server";
import { retrieveCharacter } from "./helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Création",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const returnTo = `/edit/${params.character}`;

  if (await isSecure(returnTo)) {
    const result = await retrieveCharacter(params.character);
    if (result.success) {
      // Render the page
      const builder = new ViewBuilder();
      return <PageContent character={await builder.createCharacterDetailed(result.character)} />;
    } else {
      if (result.errorCode === "notFound") {
        return notFound();
      } else {
        console.error("Unexpected error", result.message);
        throw new Error("Unexpected error");
      }
    }
  }
}
