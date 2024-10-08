import { isSecure } from "app/helpers-server";
import { PageContent } from "./PageContent";

export default async function Page({ params }: Readonly<{ params: { character: string; id: string } }>) {
  const returnTo = `/edit/${params.character}/equipment/${params.id}`;

  if (await isSecure(returnTo)) {
    return <PageContent id={params.id} />;
  }
}
