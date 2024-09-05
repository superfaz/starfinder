import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { DataSets, DataSource, type IDataSource } from "data";
import { IdSchema } from "model";
import { ViewBuilder } from "view/server";
import { isSecure } from "./helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Création",
};

export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const returnTo = `/edit/${params.character}`;

  if (await isSecure(returnTo)) {
    // Validate the parameter
    const parse = IdSchema.safeParse(params.character);
    if (!parse.success) {
      return notFound();
    }

    // Validate the request
    const characterId: string = parse.data;
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const dataSource: IDataSource = new DataSource();
    const characters = await dataSource.get(DataSets.Characters).find({ id: characterId, userId: user.id });

    if (characters.length === 0) {
      return notFound();
    } else if (characters.length > 1) {
      throw new Error("Multiple characters found with the same id");
    }

    // Render the page
    const builder = new ViewBuilder();
    return <PageContent character={await builder.createCharacterDetailed(characters[0])} />;
  }
}
