import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Metadata } from "next";
import { DataSets, DataSource, IDataSource } from "data";
import { isSecure } from "./[character]/helpers-server";
import { PageContent } from "./PageContent";
import { toViewModel } from "./viewmodel";

export const metadata: Metadata = {
  title: "Personnages",
};

export default async function Page() {
  const returnTo = `/edit`;

  if (await isSecure(returnTo)) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      // TODO 401
      return null;
    }

    const dataSource: IDataSource = new DataSource();
    const characters = await toViewModel(dataSource, await dataSource.get(DataSets.Characters).find({ userId: user.id }));

    return <PageContent characters={characters} />;
  }
}
