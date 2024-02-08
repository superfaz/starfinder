import { DataSetBuilder, IClientDataSet, IDataSet, convert } from "data";
import { ClientComponent } from "./client";

export const dynamic = "force-dynamic";

export default async function Page() {
  const builder = new DataSetBuilder();
  const serverData: IDataSet = await builder.build();
  const clientData: IClientDataSet = await convert(serverData);
  return (
    <>
      <h1>Création de personnage</h1>
      <ClientComponent data={clientData} />
    </>
  );
}
