import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/types/server";
import { DataSets, DataSource } from "data";
import { PageContent } from "./PageContent";
import { PageAuthenticated } from "./PageAuthenticated";
import { toViewModel } from "./edit/viewmodel";

export default async function Page() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  if (isUserAuthenticated) {
    const dataSource = new DataSource();
    const characters = await toViewModel(
      dataSource,
      await dataSource.get(DataSets.Characters).find({ userId: user.id })
    );
    return <PageAuthenticated characters={characters} />;
  } else {
    return <PageContent />;
  }
}
