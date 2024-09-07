import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { DataSets, DataSource } from "data";
import { ViewBuilder } from "view/server";
import { PageContent } from "./PageContent";
import { PageAuthenticated } from "./PageAuthenticated";

export default async function Page() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  if (isUserAuthenticated) {
    const dataSource = new DataSource();
    const builder = new ViewBuilder(dataSource);

    const characters = await builder.createCharacter(
      await dataSource.get(DataSets.Characters).find({ userId: user.id }, "updateOn", 3)
    );
    return <PageAuthenticated characters={characters} />;
  } else {
    return <PageContent />;
  }
}
