import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PageContent } from "./PageContent";
import { PageAuthenticated } from "./PageAuthenticated";
import { toViewModel } from "./edit/viewmodel";
import { DataSets, DataSource } from "data";

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (user !== null) {
    const dataSource = new DataSource();
    const characters = await toViewModel(dataSource, await dataSource.get(DataSets.Characters).find({ userId: user.id }));
    return <PageAuthenticated characters={characters} />;
  } else {
    return <PageContent />;
  }
}
